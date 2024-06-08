import Link from "next/link";
import { FacebookButton } from "react-social";
import * as types from '../../app/redux/types'

export default function Hero({ readingGoal }) {
  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div style={{
        width: "100%",
        height: "100vh",
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Hero content */}
        <div>
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16" style={{ padding: "0 100px" }}>
            <h1
              className="text-xl md:text-4xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Thật tuyệt vời! Bạn đã hoàn thành mục tiêu đọc sách
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                {" "}một cách xuất sắc!
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-l text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Hoàn thành {readingGoal.goalAmount} {readingGoal.goalType == "pages" ? "trang" : "quyển"} sách trong 1 {readingGoal.timeFrame == "day" ? " ngày"
                  : readingGoal.timeFrame == "week" ? " tuần"
                    : readingGoal.timeFrame == "month" ? " tháng"
                      : " năm"} là một thành tích đáng tự hào. Việc bạn hoàn thành mục tiêu này thể hiện sự quyết tâm và nỗ lực của bạn trong việc rèn luyện trí tuệ và nâng cao kiến thức. Đọc sách là một món quà quý giá dành cho bản thân, và việc bạn dành thời gian cho việc đọc sách là một lựa chọn vô cùng sáng suốt. Hãy tiếp tục nuôi dưỡng niềm đam mê đọc sách để gặt hái nhiều thành công trong cuộc sống nhé!
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <FacebookButton
                    url={`https://ebook.workon.space/reading-milestone-reached/${readingGoal._id}`}
                    appId={types.FACEBOOK_APP_ID}
                  >
                    <div
                      className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                    >
                      Chia sẻ thành tựu
                    </div>
                  </FacebookButton>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
