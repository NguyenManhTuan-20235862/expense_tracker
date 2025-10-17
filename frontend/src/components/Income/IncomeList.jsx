import React from "react";
import { LuDownload } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import { useTranslation } from "react-i18next";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  const { t } = useTranslation();
  return ( 
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{t('labelIncomeSource')}</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> {t('buttonDownload')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
