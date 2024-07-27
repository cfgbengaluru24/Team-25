import { Link } from "react-router-dom"
import campsData from "../static data/camps"

const CampList = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl ">Manage Camps</h1>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full mt-3 text-sm text-left rtl:text-right text-gray-500 removetext-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 removebg-gray-700 removetext-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Camp Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Location
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Select
                </th>
              </tr>
            </thead>
            <tbody>
              {campsData.map((camp, index) => (
                <tr key={camp.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {camp.name}
                  </th>
                  <td className="px-6 py-4">
                    {camp.location}
                  </td>
                  <td className="px-6 py-4">
                    {camp.dates}
                  </td>
                  <td className="px-6 py-4">
                    {camp.price}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={{
                      pathname: `${camp.id}`,
                      state: { location: camp.location }
                    }} className="font-medium text-blue-600 hover:underline">More Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default CampList
