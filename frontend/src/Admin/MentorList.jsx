const MentorList = () => {
  return (
    <div>
      <h1 className="text-2xl">Pick up mentors</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
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
            <tr className="odd:bg-white odd:removebg-gray-900 even:bg-gray-50 even:removebg-gray-800 border-b removeborder-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap removetext-white">
                Salman Khan
              </th>
              <td className="px-6 py-4">
                salman.khan@gmail.com
              </td>
              <td className="px-6 py-4">
                Male
              </td>
              <td className="px-6 py-4">
                12
              </td>
              <td className="px-6 py-4">
                <button  className="font-medium bg-gray-400 rounded-sm">More Info</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MentorList
