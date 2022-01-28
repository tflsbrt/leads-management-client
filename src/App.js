import { useState } from 'react';

import Button from 'react-bootstrap/Button';

import DialogModal from './components/DialogModal';

import './styles/global.scss';

const App = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleConfirm = () => {
    setShow(false);
    alert('Yes, it is');
  };

  return (
    <div className="mf2-main-page">
      <h1>Microfrontend 2</h1>
      <Button variant="warning" onClick={handleShow}>
        Open Modal
      </Button>

      <DialogModal
        title="Title"
        message="This is happening inside microfrontend 2?"
        isOpen={show}
        onSubmit={() => handleConfirm()}
        onClose={() => setShow(false)}
      />
    </div>
  );
};

export default App;
