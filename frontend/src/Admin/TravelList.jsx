import { useEffect, useState } from "react"
import campsData from "../static data/camps";
import { Link, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import { FaBus } from "react-icons/fa";
import { FaTrainSubway } from "react-icons/fa6";
import { MdFlight } from "react-icons/md";
import { FaTaxi } from "react-icons/fa";

const TravelList = () => {
  const [travel, setTravel] = useState();
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
      axios.post('http://localhost:8080/api/v1/trainer/get-flights', {
        date: selectedDate || new Date(),
        location: loc,
      })
        .then(response => {
          setTravel(response.data.trainers);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [loc, selectedDate]);

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

      <h1 className="text-2xl mt-4">Travel Bookings</h1>
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
                Means of Travel
              </th>
              <th scope="col" className="px-6 py-3">
                Booking Link
              </th>
            </tr>
          </thead>
          <tbody>
            {travel && travel.map((trainer, index) => (
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
                  <h1 className="text-lg">{(trainer.mode === "bus")?<FaBus/> : (trainer.mode === "flight") ? <MdFlight/> : (trainer.mode === "train") ? <FaTrainSubway/> : <FaTaxi/>}</h1>
                </td>
                <td className="px-6 py-4">
                  <Link to={trainer.bookingUrl} className="font-medium bg-blue-500 rounded-lg p-1.5 text-white mr-2">Travel Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TravelList
