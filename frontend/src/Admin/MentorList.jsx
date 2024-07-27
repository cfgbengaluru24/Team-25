import { useState } from "react"
import trainersData from "../static data/trainers"

const MentorList = () => {
  const [trainerData, setTrainerData] = useState(trainersData);
  const [checkbox, setCheckbox] = useState();

  const selectTrainer = (id) => {
    setTrainerData((prev) => prev.map((trainer)=>{
      (trainer.id === id) ? {...trainer, chosen: !trainer.chosen} : trainer
    }))
  }

  return (
    <div>
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
                Select
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {trainersData.map((trainer, index) => (
              (trainer.chosen)?<tr key={trainer.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                  {trainer.experience}
                </td>
                <td className="px-6 py-4">
                  <input  type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </td>
                <td className="px-6 py-4">
                  <button className="font-medium bg-gray-400 rounded-lg p-1.5 text-white">More Info</button>
                </td>
              </tr>:""
            ))}
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {trainersData.map((trainer, index) => (
              (!trainer.chosen)?(<tr key={trainer.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                  {trainer.experience}
                </td>
                <td className="px-6 py-4">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                </td>
                <td className="px-6 py-4">
                  <button className="font-medium bg-gray-400 rounded-lg p-1.5 text-white">More Info</button>
                </td>
              </tr>): ""
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MentorList
