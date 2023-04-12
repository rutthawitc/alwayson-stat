import React from 'react';

function ExportToCsv({ data, filename }) {
  function downloadCsv() {
    const csv = convertToCsv(data);
    const BOM = '\uFEFF';
    const csvBom = BOM + csv;
    const csvData = new Blob([csvBom], {
      type: 'data:text/csv;charset=utf-8;',
    });
    const csvUrl = URL.createObjectURL(csvData);
    const hiddenLink = document.createElement('a');
    hiddenLink.href = csvUrl;
    hiddenLink.target = '_blank';
    hiddenLink.download = `${filename}.csv`;
    hiddenLink.click();
  }
  function convertToCsv(arr) {
    const header = Object.keys(arr[0]).join(',');
    const rows = arr.map((obj) => Object.values(obj).join(','));
    return `${header}\n${rows.join('\n')}`;
  }
  return (
    <button
      onClick={downloadCsv}
      className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-sm w-full sm:w-auto'
    >
      Export to CSV
    </button>
  );
}

export default ExportToCsv;
