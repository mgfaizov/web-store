import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import './modal.css';

const Modal = ({ content, closeModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modalElement = (
      <div className="myModal">
        <div className="myModalWrapper">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <div className="rec-prism">{content}</div>
        </div>
      </div>
    );
    ReactDOM.render(modalElement, modalRef.current);
    return () => {
      ReactDOM.unmountComponentAtNode(modalRef.current);
    };
  }, [content, closeModal]);

  return (
    <div className="modalContainer" ref={modalRef}></div>
  );
};

export default Modal;