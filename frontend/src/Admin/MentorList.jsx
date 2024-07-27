import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import campsData from "../static data/camps";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MentorList = () => {
  const [trainerData, setTrainerData] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loc, setLoc] = useState();
  const location = useLocation();
  const campid = parseInt(location.pathname.split('/')[3]);

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
      axios.post('http://localhost:8080/api/v1/trainer/get-trainers', {
        selected_date: selectedDate || new Date(),
        address: loc,
      })
        .then(response => {
          setTrainerData(response.data.trainers);
          setSelectedTrainer(response.data.selectedTrainers)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [loc, selectedDate]);

  const acceptFunc = (id) =>{
    axios.post('http://localhost:8080/api/v1/trainer/accept', {
      session_date: selectedDate || new Date(),
      id: id,
    })
      .then(response => {
        
      })
      .catch(error => {
        console.error('Error:', error);
      });

      axios.post('http://localhost:8080/api/v1/trainer/get-trainers', {
        selected_date: selectedDate || new Date(),
        address: loc,
      })
        .then(response => {
          setTrainerData(response.data.trainers);
          setSelectedTrainer(response.data.selectedTrainers)
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }

  const denyFunc = (id) =>{
    axios.post('http://localhost:8080/api/v1/trainer/reject', {
      session_date: selectedDate || new Date(),
      id: id,
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

      axios.post('http://localhost:8080/api/v1/trainer/get-trainers', {
        selected_date: selectedDate || new Date(),
        address: loc,
      })
        .then(response => {
          setTrainerData(response.data.trainers);
          setSelectedTrainer(response.data.selectedTrainers)
        })
        .catch(error => {
          console.error('Error:', error);
        });
  }

  return (
    <div>
      <p className="text-xl">Location: {loc}</p>

      <h1 className="text-lg mt-4">Date: </h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholderText="Select date"
      />

      <h1 className="text-2xl mt-4">Chosen trainers</h1>
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedTrainer && selectedTrainer.map((trainer, index) => (
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
                <Link to={"../travel/"+campid} className="font-medium bg-purple-500 rounded-lg p-1.5 text-white mr-2">Book Tickets</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className="text-2xl mt-12">Pick trainers</h1>
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
                  <button onClick={()=>acceptFunc(trainer._id)} className="font-medium bg-green-500 rounded-lg p-1.5 text-white mr-2">Accept</button>
                  <button onClick={()=> denyFunc(trainer._id)} className="font-medium bg-red-500 rounded-lg p-1.5 text-white">Deny</button>
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
