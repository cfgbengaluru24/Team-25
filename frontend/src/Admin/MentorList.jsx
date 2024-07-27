import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import campsData from "../static data/camps";
import axios from 'axios';

const MentorList = () => {
  const [trainerData, setTrainerData] = useState(null);
  const [loc, setLoc] = useState();
  const location = useLocation();

  useEffect(() => {
    const id = parseInt(location.pathname.split('/')[3]);

    campsData.forEach((camp) => {
      if (camp.id === id) {
        setLoc(camp.location);
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    if (loc) {
      const selected_date = new Date();

      axios.post('http://localhost:8080/api/v1/trainer/get-trainers', {
        selected_date,
        address: loc,
      })
        .then(response => {
          // console.log(response.data);
          setTrainerData(response.data.trainers);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [loc]);

  const selectTrainer = (id1) => {
    setTrainerData((prev) =>
      prev.map((trainer) =>
        trainer.id === id1 ? { ...trainer, chosen: !trainer.chosen } : trainer
      )
    );
  };

  return (
    <div>
      <p>Location: {loc}</p>
      <h1 className="text-2xl">Chosen mentors</h1>
      <div className="overflow-x-auto mt-3 shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 removetext-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 removebg-gray-700 removetext-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Trainer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Camp Counts
              </th>
              <th scope="col" className="px-6 py-3">
                Experience Score
              </th>
              <th scope="col" className="px-6 py-3">
                Distance
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {trainerData && trainerData.map((trainer, index) => (
              <tr key={trainer._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {trainer.name}
                </th>
                <td className="px-6 py-4">
                  {trainer.email}
                </td>
                <td className="px-6 py-4">
                  {trainer.gender}
                </td>
                <td className="px-6 py-4">
                  {trainer.camp_counts}
                </td>
                <td className="px-6 py-4">
                  {trainer.experience_score}
                </td>
                <td className="px-6 py-4">
                  {trainer.distance !== undefined ? trainer.distance.toFixed(2) : 'N/A'} km
                </td>
                <td className="px-6 py-4">
                  <button className="font-medium bg-green-500 rounded-lg p-1.5 text-white mr-2">Accept</button>
                  <button className="font-medium bg-red-500 rounded-lg p-1.5 text-white">Deny</button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>

      <h1 className="text-2xl mt-12">Pick up mentors</h1>
      <div className="overflow-x-auto mt-3 shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 removetext-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 removebg-gray-700 removetext-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Trainer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Camp Counts
              </th>
              <th scope="col" className="px-6 py-3">
                Experience Score
              </th>
              <th scope="col" className="px-6 py-3">
                Distance
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {trainerData && trainerData.map((trainer, index) => (
              <tr key={trainer._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {trainer.name}
                </th>
                <td className="px-6 py-4">
                  {trainer.email}
                </td>
                <td className="px-6 py-4">
                  {trainer.gender}
                </td>
                <td className="px-6 py-4">
                  {trainer.camp_counts}
                </td>
                <td className="px-6 py-4">
                  {trainer.experience_score}
                </td>
                <td className="px-6 py-4">
                  {trainer.distance !== undefined ? trainer.distance.toFixed(2) : 'N/A'} km
                </td>
                <td className="px-6 py-4">
                  <button className="font-medium bg-green-500 rounded-lg p-1.5 text-white mr-2">Accept</button>
                  <button className="font-medium bg-red-500 rounded-lg p-1.5 text-white">Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorList;
