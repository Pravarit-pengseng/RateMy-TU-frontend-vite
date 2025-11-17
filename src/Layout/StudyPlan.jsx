import React, { useState } from 'react';
import { HomeIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const StudyPlan = () => {

  const [selectedPlan, setSelectedPlan] = useState('66');

  return (
    <div className="min-h-screen bg-[#2d3441] flex">
      {/* Sidebar */}
      <aside className="fixed w-32 h-full bg-gradient-to-b from-[#3a3f4a] to-[#3a3f4a] flex-shrink-0 flex flex-col">
        <div className="p-4 mt-24 space-y-2">
          {/* Plan 66 with arrow */}
          <button
            onClick={() => setSelectedPlan('66')}
            className={`w-full rounded-lg p-3 text-center transition-all ${
              selectedPlan === '66'
                ? 'bg-[#f5b235] text-black font-bold shadow-lg'
                : 'bg-[#f7c05a] text-gray-700 hover:bg-[#f8ad1f]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">ฉบับ 66</span>
              {selectedPlan !== '66' && <ChevronLeftIcon className="h-4 w-4" />}
              {selectedPlan == '66' && <ChevronRightIcon className="h-4 w-4" />}
            </div>
          </button>

          {/* Plan 66 large button */}
          {/* <div
            className={`rounded-lg p-6 text-center transition-all ${
              selectedPlan === '66'
                ? 'bg-white text-gray-800 font-bold shadow-xl'
                : 'bg-gray-400 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">ฉบับ 66</span>
              {selectedPlan === '66' && <ChevronRightIcon className="h-5 w-5" />}
            </div>
          </div> */}

          {/* Plan 68 large button */}
          {/* <div
            className={`rounded-lg p-6 text-center transition-all ${
              selectedPlan === '68'
                ? 'bg-white text-gray-800 font-bold shadow-xl'
                : 'bg-gray-400 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">ฉบับ 68</span>
              {selectedPlan === '68' && <ChevronRightIcon className="h-5 w-5" />}
            </div>
          </div> */}

          {/* Plan 68 with arrow */}
          <button
            onClick={() => setSelectedPlan('68')}
            className={`w-full rounded-lg p-3 text-center transition-all ${
              selectedPlan === '68'
                ? 'bg-[#f5b235] text-black font-bold shadow-lg'
                : 'bg-[#f7c05a] text-gray-700 hover:bg-[#f8ad1f]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">ฉบับ 68</span>
              {selectedPlan !== '68' && <ChevronLeftIcon className="h-4 w-4" />}
              {selectedPlan == '68' && <ChevronRightIcon className="h-4 w-4" />}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-32 flex-1 flex flex-col">
        {/* Title */}
        <div className="bg-[#2d3441] p-6 text-center">
          <h2 className="text-3xl font-bold text-white">แผนการศึกษา</h2>
        </div>

        {/* Plan Display Area */}
        <div className="flex-1 p-6 overflow-auto bg-[#2d3441]">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-2xl p-2">
            {selectedPlan === '66' ? (
              <img
                src="../../assets/plan66.png"
                alt="แผนการศึกษา ฉบับ 66 - หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์ พ.ศ. 2566"
                className="w-full h-auto rounded"
              />
            ) : (
              <img
                src="../../assets/plan68.png"
                alt="แผนการศึกษา ฉบับ 68 - หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์ พ.ศ. 2568"
                className="w-full h-auto rounded"
              />
            )}
          </div>
          
          {/* Download button
          <div className="max-w-7xl mx-auto mt-4 flex justify-center">
            <a
              href={selectedPlan === '66' ? '/assets/plan66.png' : '/assets/plan68.png'}
              download={`แผนการศึกษา_ฉบับ${selectedPlan}.png`}
              className="px-6 py-3 bg-gradient-to-r from-[#26268c] to-[#42a5f5] text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              ดาวน์โหลดแผนการศึกษา ฉบับ {selectedPlan}
            </a>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;