import React from 'react';
import { CSVLink } from 'react-csv';

const ExportButton = ({ data }) => {
  const headers = [
    { label: 'Institución', key: 'majorOrgCode' },
    { label: 'Código Carrera', key: 'prgdMajorCode' },
    { label: 'Plan', key: 'prgdProgCode' },
    { label: 'Nivel', key: 'prgdLevel' },
    { label: 'Código Asignatura', key: 'coursCode' },
    { label: 'Asignatura', key: 'coursDescription' },
    { label: 'Régimen', key: 'coursDuration' },
    { label: 'Código Clase', key: 'stdcItemCode' },
    { label: 'Clase', key: 'itemDescription' },
    { label: 'Rendimiento', key: 'stdcPerformance' },
    { label: 'Ciclo Mantención', key: 'stdcMaintenanceCicle' },
    { label: 'Ciclo de Renvación', key: 'stdcRenewalCicle' },
    { label: 'Código Recinto', key: 'stdcRlayCode' },
    { label: 'Recinto', key: 'rlayDescription' },
  ];

  return (
    // <div className={styles}>
    //     <button className='btn btn-primary'>
    //         <i className='fa fa-file-download'></i>
    //         <span> Exportar</span>
    //     </button>
    // </div>
    <CSVLink
      data={data}
      headers={headers}
      className="btn btn-primary"
      separator={';'}
      filename={`standard_major_report_${new Date().toLocaleDateString()}.csv`}>
      <i className="fa fa-file-download" />
      <span> Exportar</span>
    </CSVLink>
  );
};

export default ExportButton;
