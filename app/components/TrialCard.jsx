// components/TrialCard.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons';

const TrialCard = ({ trial }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'COMPLETED':
        return <FontAwesomeIcon icon={faFlagCheckered} className="text-blue-500" />;
      case 'TERMINATED':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      case 'NOT_YET_RECRUITING':
        return <FontAwesomeIcon icon={faSpinner} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faSpinner} className="text-gray-500" />;
    }
  };

  // Extract the NCT ID safely
  const nctId = trial.protocolSection?.identificationModule?.nctId || '';
  const briefTitle = trial.protocolSection?.identificationModule?.briefTitle || 'No Title Available';
  const overallStatus = trial.protocolSection?.statusModule?.overallStatus?.replace(/_/g, ' ') || 'Unknown Status';
  const startDate = trial.protocolSection?.statusModule?.startDateStruct?.date || 'N/A';
  const completionDate = trial.protocolSection?.statusModule?.completionDateStruct?.date || 'N/A';

  // Construct the URL
  const trialUrl = `https://clinicaltrials.gov/study/${nctId}`;

  return (
    <a
      href={trialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="border border-blue-300 rounded shadow-md p-4 flex flex-col justify-between bg-white hover:bg-blue-100 transition-colors duration-300">
        <div>
          <h2 className="font-semibold text-xl mb-2 text-blue-800">
            {briefTitle}
          </h2>
          <p className="text-sm text-blue-700 mb-2">
            <strong>NCT ID:</strong> {nctId}
          </p>
          <p className="text-sm text-blue-700 mb-2">
            <strong>Status:</strong>{' '}
            <span>
              {getStatusIcon(trial.protocolSection?.statusModule?.overallStatus)}{' '}
              {overallStatus}
            </span>
          </p>
          <p className="text-sm text-blue-700 mb-2">
            <strong>Start Date:</strong> {startDate}
          </p>
          <p className="text-sm text-blue-700 mb-2">
            <strong>Completion Date:</strong> {completionDate}
          </p>
        </div>
      </div>
    </a>
  );
};

export default TrialCard;