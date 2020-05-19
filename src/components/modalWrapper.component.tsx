import React from 'react'
import Modal from 'react-modal'

interface Props extends React.ComponentProps<typeof Modal> {
  children: React.ReactNode
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export const ModalWrapper: React.FC<Props> = props => {
  const { onRequestClose, children, ...restProps } = props

  React.useEffect(() => {
    Modal.setAppElement('#root')
  }, [])

  return (
    <Modal
      {...restProps}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      style={customStyles}
    >
      {children}
    </Modal>
  )
}
