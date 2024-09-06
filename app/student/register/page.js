'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';

export default function Register() {
  const [fullnames, setFullnames] = useState([]);
  const [filteredFullnames, setFilteredFullnames] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [tribus, setTribus] = useState([]);
  const [selectedFullname, setSelectedFullname] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [selectedTribu, setSelectedTribu] = useState('');
  const [qrCode, setQrCode] = useState('');
  const qrCodeRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost/attendance/register.php')
      .then(response => response.json())
      .then(data => {
        setFullnames(data.fullnames || []);
        setYearLevels(data.yearLevels || []);
        setTribus(data.tribus || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = fullnames.filter(name =>
      (selectedYearLevel ? name.year_level_id === parseInt(selectedYearLevel, 10) : true) &&
      (selectedTribu ? name.tribu_id === parseInt(selectedTribu, 10) : true)
    );
    setFilteredFullnames(filtered);
  }, [fullnames, selectedYearLevel, selectedTribu]);

  const handleGenerateQRCode = () => {
    const studentData = {
      fullname: selectedFullname,
      year_level: selectedYearLevel,
      tribu: selectedTribu
    };

    const generatedQrCode = JSON.stringify(studentData);
    setQrCode(generatedQrCode);
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('QR code canvas not found');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
        QR Code Registration
      </h1>
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateQRCode(); }} className="space-y-6">
          <div>
            <label htmlFor="year-level" className="block text-lg font-semibold mb-2 text-gray-800">Year Level</label>
            <select
              id="year-level"
              value={selectedYearLevel}
              onChange={(e) => {
                setSelectedYearLevel(e.target.value);
                setSelectedTribu('');
                setSelectedFullname('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year Level</option>
              {yearLevels.map((level) => (
                <option key={level.year_level_id} value={level.year_level_id}>{level.level}</option>
              ))}
            </select>
          </div>
          {selectedYearLevel && (
            <div>
              <label htmlFor="tribu" className="block text-lg font-semibold mb-2 text-gray-800">Tribu</label>
              <select
                id="tribu"
                value={selectedTribu}
                onChange={(e) => {
                  setSelectedTribu(e.target.value);
                  setSelectedFullname('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Tribu</option>
                {tribus.map((tribu) => (
                  <option key={tribu.tribu_id} value={tribu.tribu_id}>{tribu.name}</option>
                ))}
              </select>
            </div>
          )}
          {selectedYearLevel && selectedTribu && (
            <div>
              <label htmlFor="fullname" className="block text-lg font-semibold mb-2 text-gray-800">Full Name</label>
              <select
                id="fullname"
                value={selectedFullname}
                onChange={(e) => setSelectedFullname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Full Name</option>
                {filteredFullnames.map((name, index) => (
                  <option key={index} value={name.fullname}>{name.fullname}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Generate QR Code
          </button>
        </form>
        {qrCode && (
          <div className="mt-8 flex flex-col items-center">
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-lg">
              <QRCode
                value={qrCode}
                size={256}
                renderAs="canvas"
              />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
