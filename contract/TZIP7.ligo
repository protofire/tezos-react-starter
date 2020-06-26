type tokenAction is
| GetAllowance of (address * address * contract(nat))
| Transfer of (address * address * nat)
| Approve of (address * nat)
| GetBalance of (address * contract(nat))
| GetTotalSupply of (unit * contract(nat))
| Mint of (nat)
| Burn of (nat)
| AddOwner of (address)
| Symbol of (unit * contract(string))
| Name of (unit * contract(string))
| Decimals of (unit * contract(nat))

type account is record
  balance: nat;
  allowances: map(address, nat);
end

type store is record
  owners: set(address);
  decimals: nat; // Added this property used in the erc20 ethereum specification
  symbol: string; // Added this property used in the erc20 ethereum specification
  name: string; // Added this property used in the erc20 ethereum specification
  totalSupply: nat;
  accounts: big_map(address, account);
end

type return is list(operation) * store;

const emptyOps : list(operation) = list end;

const emptyAllowances : map(address,nat) = map end;

function getAccount (const addressAccount : address ; const accounts: big_map(address, account)) : account is
  block { skip } with
    case accounts[addressAccount] of
      | Some(account) -> account
      | None -> record balance = 0n; allowances = emptyAllowances; end
    end

function getAllowance(const addressAccount : address ; const allowances : map(address, nat)) : nat is
  block { skip } with
    case allowances[addressAccount] of
      | Some(value) -> value
      | None -> 0n
    end

function allowance (const addressOwner : address; const addressSpender : address; const callback : contract(nat); var store : store) : return is
  block {
    const storeAccountOwner: account = getAccount(addressOwner, store.accounts);
    var allowed: nat :=  getAllowance(addressSpender, storeAccountOwner.allowances); 

    const allowedOperation: operation = Tezos.transaction(allowed, 0tz, callback);
    operations := list 
        allowedOperation 
    end;
  } with (operations, store);

function isAllowed (const addressOwner : address; const addressSpender : address; const value : nat; var store : store) : bool is
  block {
    var isAllowed: bool := True;
    if Tezos.sender =/= addressOwner then block {
      const storeAccountOwner: account = getAccount(addressOwner, store.accounts);
      var allowedAmount: nat :=  getAllowance(addressSpender, storeAccountOwner.allowances);
      isAllowed := allowedAmount >= value;
    } else skip;
  } with isAllowed;

function isOwner (const addressOwner : address; var store : store) : bool is
  block {
    const isOwner : bool = store.owners contains addressOwner;
  } with isOwner;  

function updateOwners (var newAddress: address; var owners : set (address)) : set (address) is 
  block {
    patch owners with set [newAddress];
  } with owners;

function addOwner (const ownerAddress : address; var store : store) : return is
  block {
    case isOwner(Tezos.sender, store) of 
    | False -> failwith ("Sender not allowed to perform this action")
    | True -> skip
    end;
    store.owners := updateOwners(ownerAddress, store.owners);
    
  } with (emptyOps, store);

function approve (const addressSpender : address; const value : nat; var store : store) : return is
  block {
    // If sender is the spender approving is not necessary
    if Tezos.sender = addressSpender then failwith("SenderAndSpenderCannotBeTheSame");
    else block {
        const senderAccount: account = getAccount(Tezos.sender, store.accounts);
        var allowed: nat :=  getAllowance(addressSpender, senderAccount.allowances); 

        // Changing allowance value from non-zero value to a non-zero value is forbidden to prevent the corresponding attack vector.
        if allowed =/= 0n then failwith("UnsafeAllowanceChange");
        else block {
          // TODO: maybe this need a patch ?
          senderAccount.allowances[addressSpender] := value;
          store.accounts[Tezos.sender] := senderAccount;
        }
    }
  } with (emptyOps, store);

function transfer (const addressFrom : address; const addressTo : address; const value : nat; var store : store) : return is
  block {
    // #1 First check: when called with "from" account equal to the transaction sender, we assume that
    // the user transfers their own money and this does not require approval.
    if addressFrom = addressTo then failwith ("SameOriginAndDestinationAddress");
    else block {
      // #2 NotEnoughAllowance: the transaction sender must be previously authorized to transfer at 
      // least the requested number of tokens from the "from" account using the approve
      case isAllowed(addressFrom, addressTo, value, store) of 
      | False -> block {
          failwith ("NotEnoughAllowance");
        }
      | True -> skip
      end;

      const addressFromAccount: account = getAccount(addressFrom, store.accounts);
      // #3 NotEnoughBalance: check that the accountFrom can spend that much
      if value > addressFromAccount.balance
      then failwith ("NotEnoughBalance");
      else skip;

      // Update balances
      const newFromBalance :nat = abs(addressFromAccount.balance - value);  // ensure non negative
      patch addressFromAccount with record [balance = newFromBalance];
      store.accounts[addressFrom] := addressFromAccount;

      const addressToAccount: account = getAccount(addressTo, store.accounts);
      const newToBalance :nat = addressToAccount.balance + value;  // ensure non negative
      patch addressToAccount with record [balance = newToBalance];
      store.accounts[addressTo] := addressToAccount;

      // Decrease allowances
      case store.accounts[addressFrom] of
        | None -> skip
        | Some(account) -> block {
            case account.allowances[addressTo] of
              | None -> skip
              | Some(allowanceAmount) -> block {
                  account.allowances[addressTo] :=  abs(allowanceAmount - value);
                  store.accounts[addressFrom] := record balance = addressFromAccount.balance; allowances = account.allowances; end;
                }
            end;
          }
      end;
    }
  } with (emptyOps, store);

function mint (const value : nat ; var store : store) : return is
 block {
  // Fail if is not an owner
  if not isOwner(Tezos.sender, store) then failwith("You must be an owner of the contract to mint tokens");
  else block {
    var ownerAccount: account := record 
        balance = 0n;
        allowances = (map end : map(address, nat));
    end;
    case store.accounts[Tezos.sender] of
    | None -> skip
    | Some(n) -> ownerAccount := n
    end;

    // Update the owner balance and totalSupply
    const newBalance :nat = ownerAccount.balance + value;
    patch ownerAccount with record [balance = newBalance];
    store.accounts[Tezos.sender] := ownerAccount;

    store.totalSupply := store.totalSupply + value;
  }
 } with (emptyOps, store)

function burn (const value : nat ; var store : store) : return is
 block {
  // Fail if is not an owner
  if not isOwner(Tezos.sender, store) then failwith("You must be an owner of the contract to burn tokens");
  else block {
    var ownerAccount: account := record 
        balance = 0n;
        allowances = (map end : map(address, nat));
    end;
    case store.accounts[Tezos.sender] of
    | None -> skip
    | Some(n) -> ownerAccount := n
    end;

    // Check that the owner can spend that much
    if value > ownerAccount.balance 
    then failwith ("NotEnoughBalance");
    else skip;

    // Check totalSupply
    if value > store.totalSupply 
    then failwith ("TotalSupply is too low");
    else skip;

    // Update balances and totalSupply
    const newBalance :nat =  abs(ownerAccount.balance - value);
    patch ownerAccount with record [balance = newBalance];
    store.accounts[Tezos.sender] := ownerAccount;

    store.totalSupply := abs(store.totalSupply - value);
  }
 } with (emptyOps, store)


function balanceOf (const addressOwner : address; const callback : contract(nat); var store : store) : return is
  block {
    const addressOwnerAccount: account = getAccount(addressOwner, store.accounts);
    const addressOwnerBalance: nat = addressOwnerAccount.balance;

    const addressOwnerBalanceOperation: operation = Tezos.transaction(addressOwnerBalance, 0tz, callback);
    operations := list 
        addressOwnerBalanceOperation 
    end; 
  } with (operations, store);

function totalSupply (const callback : contract(nat); var store : store) : return is
  block {
    var totalSupply: nat := store.totalSupply;

    const totalSupplyOperation: operation = transaction(totalSupply, 0mutez, callback);
    operations := list 
        totalSupplyOperation 
    end;  
  } with (operations, store);

function decimals (const callback : contract(nat); var store : store) : return is
  block {
    var decimals: nat := store.decimals;

    const decimalsOperation: operation = Tezos.transaction(decimals, 0mutez, callback);
    operations := list 
        decimalsOperation 
    end;  
} with (operations, store);

function name (const callback : contract(string); var store : store) : return is
  block {
    var name: string := store.name;

    const nameOperation: operation = Tezos.transaction(name, 0mutez, callback);
    operations := list 
        nameOperation 
    end;  
} with (operations, store);

function symbol (const callback : contract(string); var store : store) : return is
  block {
    var symbol: string := store.symbol;

    const symbolOperation: operation = Tezos.transaction(symbol, 0mutez, callback);
    operations := list 
        symbolOperation 
    end;  
} with (operations, store);

function main (const action : tokenAction ; const store : store) : return is 
  block {
    if amount =/= 0tz then failwith ("This contract do not accept token amount");
    else skip;
  } with case action of
    GetAllowance(n) -> allowance(n.0, n.1, n.2, store)
    | Transfer(n) -> transfer(n.0, n.1, n.2, store)
    | Approve(n) -> approve(n.0, n.1, store)
    | GetBalance(n) -> balanceOf(n.0, n.1, store)
    | GetTotalSupply(n) -> totalSupply(n.1, store)
    | Mint(n) -> mint(n, store)
    | Burn(n) -> burn(n, store)
    | AddOwner(n) -> addOwner(n, store)
    | Decimals(n) -> decimals(n.1, store)
    | Symbol(n) -> symbol(n.1, store)
    | Name(n) -> name(n.1, store)
    end;