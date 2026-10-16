export const URL_CLASSROOM = {
  COURSE: '/api/classroom/course/',
  ROOM: "/api/classroom/room/",
  CURRICULUM: "/api/classroom/curriculum/",
  CURRICULUM_NO_PAGINATION: "/api/classroom/curriculum/?pagination=false",
  TIMESLOT: "/api/classroom/time_slot/",
  TIMESLOT_NO_PAGINATION: "/api/classroom/time_slot/?pagination=false",
  SESSION: "/api/classroom/session/",
  ATTENDANCE: "/api/classroom/attendance/",
  SCHEDULE: "/api/classroom/schedule/",
  SCHEDULE_NO_PAGINATION: "/api/classroom/schedule/?pagination=false",
};

export const URL_MEMBER = {
  TEACHER: '/api/member/teacher/',
  STUDENT: '/api/member/student/',
  STUDENT_NO_PAGINATION: '/api/member/student/?pagination=False',
  LEAD: '/api/member/lead/',
  LEAD_APPROVED: '/api/member/lead/?approve=true',
  LEAD_UNAPPROVE: '/api/member/lead/?approve=false',
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