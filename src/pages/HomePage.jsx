import { Link } from 'react-router-dom'
import ChatBox from '../components/common/ChatBox'
import Footer from '../components/layout/Footer'
import akadaImg from '../assets/images/akada.png'
import panaImg from '../assets/images/pana.png'
import jodiImg from '../assets/images/jodi.png'
import motorImg from '../assets/images/motor.png'
import horoscopeMainImg from '../assets/images/Todays-Horoscope.png'
import horoscopeIcon from '../assets/images/Horoscope.png'

const resultCards = [
  { title: 'Madhur Morning Result', variant: 'default', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
  { title: 'Madhur Morning Result', variant: 'default', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
  { title: 'Madhur Morning Result', variant: 'yellow', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
  { title: 'Madhur Morning Result', variant: 'default', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
  { title: 'Madhur Morning Result', variant: 'default', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
  { title: 'Madhur Morning Result', variant: 'blue', timer: { hr: '1', min: '12', sec: '05' }, digits: ['0','7','2','-','7','5','8','-','9','2','4'] },
]

const luckyCards = [
  { img: akadaImg, title: 'Aakda', numbers: [1, 1, 1, 1] },
  { img: panaImg, title: 'PANA', numbers: [1, 1, 1, 1] },
  { img: jodiImg, title: 'Jodi', numbers: [1, 1, 1, 1] },
  { img: motorImg, title: 'Motor', numbers: [1, 1, 1, 1] },
]

const scheduleData = [
  { name: 'Madhur Morning', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Madhur Day', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Kamdhenu Day', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Madhur Evening', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Dhanlaxmi Day', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Kalyan', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Dhanlaxmi Night', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Madhur Night', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Madhur Shubhank', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Kamdhenu Night', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Main', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Dhanlaxmi Morning', open: '11.30 PM', close: '12.30 PM' },
  { name: 'Time', open: '11.30 PM', close: '12.30 PM' },
]

function ResultCard({ title, variant, timer, digits }) {
  const bodyClass = variant === 'yellow' ? 'result-card-body yellow-bg' : variant === 'blue' ? 'result-card-body blue-bg' : 'result-card-body'
  const timerBoxClass = variant === 'yellow' ? 'timer-box-yellow' : variant === 'blue' ? 'timer-box-blue' : 'timer-box'

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mt-2 mb-3">
      <div className="result-card">
        <div className="result-card-header">
          <h6 className="mb-0 Poppins-SemiBold text-white">{title}</h6>
          <span className="live-badge Poppins-SemiBold">Live <span className="live-dot"></span></span>
        </div>
        <div className={bodyClass}>
          <div className="timer-section">
            <div>
              <div className="timer-item">
                <div className={timerBoxClass}>
                  <span className="timer-value Poppins-SemiBold">{timer.hr}</span>
                </div>
                <span className="timer-label poppins-regular text-center">Hr</span>
              </div>
            </div>
            <span className="timer-colon Poppins-SemiBold mt-4">:</span>
            <div className="timer-item">
              <div className={timerBoxClass}>
                <span className="timer-value Poppins-SemiBold">{timer.min}</span>
              </div>
              <span className="timer-label poppins-regular">Min</span>
            </div>
            <span className="timer-colon Poppins-SemiBold mt-4">:</span>
            <div className="timer-item">
              <div className={timerBoxClass}>
                <span className="timer-value Poppins-SemiBold">{timer.sec}</span>
              </div>
              <span className="timer-label poppins-regular">Sec</span>
            </div>
          </div>
          <div className="result-numbers">
            {digits.map((d, i) => (
              <span key={i} className={d === '-' ? 'result-dash Poppins-Medium' : 'result-digit Poppins-Medium'}>{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <>
      {/* Purple Bar */}
      <div className="Purple-bg mt-4">
        <div className="container py-4 mobile-p-1">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3">
              <h6 className="text-white Poppins-SemiBold mb-0">Dhamaka Guessing</h6>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7 col-7 mb-0">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">Madhur Moring</h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">{n}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 purple-bar-hide">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">Madhur Night</h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">{n}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 purple-bar-hide">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">Madhur Day</h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">{n}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-1 col-lg-1 col-sm-2 col-2 d-flex align-items-center justify-content-center">
              <div className="bg-volume">
                <i className="fas fa-volume-up text-white volume-iocn"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container">
        <h5 className="font-size-48 Poppins-Medium text-white text-center pt-5">Welcome To Madhur</h5>
        <h3 className="Poppins-Medium font-size-64 text-center text-white mt-4">
          India's<span className="poppins-bold"> No 1</span> Satta Market Site.
        </h3>
        <p className="Poppins-light text-center text-white">To get more regular updates stay connected</p>
        <div className="d-flex justify-content-center">
          <div className="telegram">
            <i className="fab fa-telegram-plane text-white font-20"></i>
          </div>
          <div className="whatup ms-4">
            <i className="fab fa-whatsapp text-white font-20"></i>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4 pb-4">
          <button className="btn bg-purple-btn">Guess Matka</button>
          <Link to="/results" className="btn outline-purple-btn ms-4">Check Results</Link>
        </div>
        <ChatBox />
      </div>

      {/* Result Cards Section */}
      <section className="section-bg pb-5">
        <div className="container-fluid pt-3">
          <div className="px-3 bg-gray minus-margin-top">
            <div className="row pt-2">
              {resultCards.map((card, i) => (
                <ResultCard key={i} {...card} />
              ))}
            </div>
          </div>
        </div>

        {/* Lucky Number Section */}
        <div className="container-fluid pt-5 pb-4">
          <h3 className="Poppins-SemiBold font-size-24 text-white text-center">Today Lucky Number</h3>
          <div className="row pt-4">
            {luckyCards.map((card, i) => (
              <div key={i} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 mb-2">
                <div className="card p-4 card-back-color">
                  <div className="img-outer-div">
                    <img src={card.img} width="60%" alt={card.title} />
                  </div>
                  <h3 className="text-white mt-4">{card.title}</h3>
                  <div className="d-flex mt-3 mb-3">
                    {card.numbers.map((n, j) => (
                      <div key={j} className={`small-box ${j > 0 ? 'ms-2' : ''}`}>
                        <span className="Poppins-Medium font-size-16">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horoscope Section */}
        <div className="container background-img">
          <div className="row p-5 align-items-center">
            <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12 col-12 p-4">
              <img src={horoscopeMainImg} width="90%" alt="Today's Horoscope" />
            </div>
            <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
              <p className="text-white">
                The Spin to Win feature does not involve real money, real predictions, or guaranteed outcomes. All numbers generated through this tool are completely random and should be treated as fun results only. The purpose of Spin to Win is to add excitement and interaction to the platform while users explore Madhur Bazar content.
              </p>
              <h4 className="text-white">Today's Horoscope</h4>
              <img src={horoscopeIcon} className="mt-3 horoscope-img" width="10%" alt="Horoscope" />
              <p className="text-white mt-3">
                Today Libra may face a demanding and hectic schedule, requiring extra effort and discipline to manage tasks effectively. It is advisable to avoid major, impulsive decisions and focus on maintaining harmony in personal relationships.
              </p>
              <div className="mt-5 text-center">
                <button className="btn purple-btn w-50" style={{ whiteSpace: 'nowrap' }}>Spin to win</button>
              </div>
            </div>
          </div>
        </div>

        {/* Lucky Number Input */}
        <div className="container card-dark-bg mt-4 p-4">
          <div className="row Lavender-Purple pt-3 g-0 align-items-center justify-content-center">
            <h3 className="text-white text-center pt-4">Show today's Lucky Number!!!</h3>
            <div className="col-md-8 col-12 d-flex justify-content-center flex-column align-items-center">
              <div className="w-75">
                <input className="input-style mt-4 w-100" type="tel" placeholder="Enter mobile number" maxLength="10" inputMode="numeric" />
              </div>
              <p className="text-white mt-4 text-center Poppins-light font-size-14">
                Ut viverra nunc nec quam luctus, non pharetra nibh lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus.
              </p>
              <div className="mt-3 mb-5">
                <button className="btn purple-btn">Show Lucky Number</button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Table */}
        <div className="container card-dark-bg mt-4 p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <h4 className="text-white poppins-bold mb-0" style={{ whiteSpace: 'nowrap' }}>Time Table</h4>
            <p className="text-white Poppins-light font-size-14 mb-0">
              justo eros, maximus a velit ac, pulvinar faucibus sapien. Vestibulum quis sodales elit. Sed ornare eleifend vehicula. In hac habitasse plate
            </p>
          </div>
          <div className="table-responsive">
            <table className="time-table w-100">
              <thead>
                <tr>
                  <th>Game Bazaar</th>
                  <th>Open Time</th>
                  <th>Open Time</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.open}</td>
                    <td>{row.close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default HomePage
