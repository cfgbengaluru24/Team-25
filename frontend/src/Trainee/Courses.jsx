import { Link } from "react-router-dom"

const Courses = () => {
  return (
    <div className="flex flex-wrap justify-center mt-4">
    {/* First Row of Cards */}
    <div className="w-full flex flex-wrap -mx-2">
      <div className="w-full md:w-1/2 px-2 mb-4">
        <div className="w-full h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg w-full h-56 object-cover" src="https://d2xduyqs25ssfe.cloudfront.net/uploads/nrf.mykademy.com/items_org/course/67.webp?v=11" alt="" />
          </a>
          <div className="p-5">
            <Link to={"http://localhost:5007"}>
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Access your communication</h5>
            </Link>
            <Link to={"http://localhost:5007"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Take Assessment
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 px-2 mb-4">
        <div className="w-full h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg w-full h-56 object-cover" src="https://www.linqto.com/wp-content/uploads/2023/12/ethics.png" alt="" />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Access your Ethics</h5>
            </a>
            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Take Assessment
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Second Row of Cards */}
    <div className="w-full flex flex-wrap -mx-2">
      <div className="w-full md:w-1/2 px-2 mb-4">
        <div className="w-full h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg w-full h-56 object-cover" src="https://media.istockphoto.com/id/1293472888/vector/critical-thinking-line-icon-editable-illustration.jpg?s=612x612&w=0&k=20&c=-pwqQPXAlWt1Uoxd2BQ81EP6QEckuwSGzxRLi6uT-SE=" alt="" />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Access your critical thinking</h5>
            </a>
            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Take Assessment
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 px-2 mb-4">
        <div className="w-full h-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img className="rounded-t-lg w-full h-56 object-cover" src="https://images.herzindagi.info/image/2023/Aug/corporate-gender-diversity.jpg" alt="" />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Access gender sensitivity </h5>
            </a>
            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Take Assessment
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  
  )
}

export default Courses
