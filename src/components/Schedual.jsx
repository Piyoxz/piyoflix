import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
const LiveShowTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>{time.toLocaleTimeString()}</p>
    </div>
  );
};
function formatDateToReadable(dateString) {
  const date = new Date(dateString);
  return format(date, "do MMMM EEEE");
}

const getSchedual = async (date) => {
   try {
    const url = `/api/schedule?date=${date}`;
    const response = await axios.get(url);
    const results = response.data.data.scheduledAnimes;
     return results;
  } catch (error) {
    console.error("Error in fetching schedual:", error);
    return null;
  }
};

const DrawerNavigation = () => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/anime/info?id=${encodeURIComponent(id)}`);
    window.location.reload();
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);

  // Generate dates
  const today = new Date();
  const dates = [];
  dates.push(formatDate(today));
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(formatDate(nextDate));
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedulePromises = dates.map((date) => getSchedual(date));
      const scheduleResults = await Promise.all(schedulePromises);
      const formattedSchedules = dates.map((date, index) => ({
        date,
        schedule: scheduleResults[index],
      }));
      setSchedules(formattedSchedules);
    };

    fetchSchedules();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="text-center">
      <button
        className={`fixed -left-12 top-1/2 z-20 rotate-90 rounded-t-lg bg-orange-700 px-5 py-2.5  text-sm font-medium text-black shadow-2xl transition-transform hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 lg:text-lg dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 ${
          drawerOpen ? "translate-x-72 lg:translate-x-96" : "translate-x-0"
        } `}
        type="button"
        onClick={toggleDrawer}
      >
        <p className="rotate-180">
          Schedule <i className="fa-solid fa-calendar-days"></i>
        </p>
      </button>

      <div
        id="drawer-navigation"
        className={`mostly-customized-scrollbar fixed left-0 top-16 z-40 h-screen w-full overflow-y-auto p-4 transition-transform lg:w-96 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-96"
        } dark:bg-gray-950`}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="whitespace-nowrap pb-4 text-start text-3xl font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          Schedules{" "}
          <span className="text-xl text-gray-600">
            <LiveShowTime />
          </span>
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          aria-controls="drawer-navigation"
          className="absolute end-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div>
          {schedules.map(({ date, schedule }, index) => (
            <div key={index} className="pb-4  text-start text-slate-300">
              <div className=" border-b-2 border-gray-800   py-2 font-mono text-2xl font-semibold text-orange-400">
                {formatDateToReadable(date)}
              </div>
              {schedule && schedule.length > 0 ? (
                <div>
                  {schedule.map((item, itemIndex) => (
                    <div className="flex p-1" key={itemIndex}>
                      <div className="w-1/4 text-gray-400 ">{item.time} </div>
                      <div
                        onClick={() => handleClick(item.id)}
                        className="line-clamp-1 w-3/4 cursor-pointer text-gray-600"
                      >
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No schedule available</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawerNavigation;
