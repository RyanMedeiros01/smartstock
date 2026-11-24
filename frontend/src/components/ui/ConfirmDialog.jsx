import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, title, message, confirmText = 'Confirmar', onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      width={420}
      footer={<><Button onClick={onClose}>Cancelar</Button><Button variant="danger" onClick={onConfirm}>{confirmText}</Button></>}
    >
      <p style={{ lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}
