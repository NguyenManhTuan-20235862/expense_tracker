import React from "react";
import { useTranslation } from 'react-i18next';

const DeleteAlert = ({ content, onDelete }) => {
  
  const {t} = useTranslation();
  return (
    <div>
      <p className="text-sm ">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={onDelete}
        >
          {t('buttonDelete')}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
