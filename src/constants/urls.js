export const URL_CLASSROOM = {
  COURSE: '/api/classroom/course/',
  ROOM: "/api/classroom/room/",
  CURRICULUM: "/api/classroom/curriculum/",
  TIMESLOT: "/api/classroom/time_slot/",
  SESSION: "/api/classroom/session/",
  ATTENDANCE: "/api/classroom/attendance/"
};

export const URL_MEMBER = {
  TEACHER: '/api/member/teacher/',
  STUDENT: '/api/member/student/',
  STUDENT_NO_PAGINATION: '/api/member/student/?pagination=False',
  LEAD: '/api/member/lead/',
  GET_SCHOOL: "/api/member/get_school/",
  SCHOOL: "/api/member/school/",
  ADD_CREDIT: "/api/member/add_credit/",
  USE_CREDIT: "/api/member/use_credit/",
  VIEW_CREDIT: "api/member/view_credit/",
};

export const URL_TOKEN = {
  TOKEN: '/auth/token/',
  LOGOUT: '/auth/logout/',
  ME: '/auth/me'
}