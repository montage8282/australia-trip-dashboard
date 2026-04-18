"use client";

import { useEffect, useState } from "react";

const PASSWORD = "1234";

type MainTab = "home" | "flights" | "stays" | "places" | "checklist";

type ScheduleItem = {
  date: string;
  city: string;
  title: string;
  time?: string;
  note: string;
};

type FlightPassenger = {
  name: string;
  seat?: string;
  cabinBag?: string;
  checkedBag?: string;
  meal?: string;
};

type FlightBooking = {
  title: string;
  route: string;
  date: string;
  time: string;
  bookingRef: string;
  flightNo: string;
  aircraft?: string;
  duration?: string;
  fromDetail: string;
  toDetail: string;
  price: string;
  note?: string;
  passengers: FlightPassenger[];
};

type StayItem = {
  city: string;
  name: string;
  period: string;
  nights: string;
  note: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
  price?: string;
  bookingRef?: string;
  phone?: string;
  email?: string;
  paymentDue?: string;
  paymentStatus?: string;
};

type PlaceItem = {
  name: string;
  city: string;
  category: string;
  address?: string;
  link?: string;
  note?: string;
  lat: number;
  lon: number;
};

type ChecklistGroup = {
  title: string;
  emoji: string;
  items: string[];
};

type WeatherCity = {
  key: string;
  label: string;
  lat: number;
  lon: number;
};

type WeatherState = {
  temperature: number;
  apparent: number;
  wind: number;
  code: number;
};

type TransportCompare = {
  title: string;
  duration: string;
  cost: string;
  level: string;
  note: string;
};

const weatherCities: WeatherCity[] = [
  { key: "Sydney", label: "Sydney", lat: -33.8688, lon: 151.2093 },
  { key: "Gold Coast", label: "Gold Coast", lat: -28.0167, lon: 153.4 },
  { key: "Brisbane", label: "Brisbane", lat: -27.4698, lon: 153.0251 },
];

const schedule: ScheduleItem[] = [
  { date: "6/4", city: "인천", title: "인천 출발", time: "21:50", note: "젯스타 국제선 탑승 / 시드니행" },
  { date: "6/5", city: "Sydney", title: "시드니 도착 / 체크인", time: "09:05 도착", note: "시드니 공항 도착 후 숙소 이동" },
  { date: "6/6", city: "Sydney", title: "시드니 여행", note: "도심 / BBQ 장소 / 추가 일정 넣기" },
  { date: "6/7", city: "Sydney", title: "시드니 여행", note: "장소 계속 추가 가능" },
  { date: "6/8", city: "Sydney → Brisbane → Gold Coast", title: "도시 이동", time: "18:25 출발", note: "시드니에서 브리즈번 이동 후 골드코스트로 이동" },
  { date: "6/9", city: "Gold Coast", title: "골드코스트 여행", note: "해변 / 씨월드 / 주변 일정" },
  { date: "6/10", city: "Gold Coast", title: "골드코스트 여행", note: "추가 장소 및 식당 정리" },
  { date: "6/11", city: "Gold Coast → Brisbane", title: "브리즈번 이동", note: "체크아웃 후 브리즈번 숙소 체크인" },
  { date: "6/12", city: "Brisbane", title: "브리즈번 여행", note: "시내 일정 / 휴식 / 쇼핑" },
  { date: "6/13", city: "Brisbane", title: "귀국", time: "11:10 출발", note: "브리즈번에서 인천으로 귀국" },
];

const transportCompare: TransportCompare[] = [
  {
    title: "기차 + 트램",
    duration: "약 1시간 40분 ~ 2시간 10분",
    cost: "약 AUD 20~30",
    level: "가성비",
    note: "짐이 아주 많지 않으면 가장 무난. 비용 절약에 유리.",
  },
  {
    title: "우버",
    duration: "약 1시간 ~ 1시간 20분",
    cost: "약 AUD 120~180",
    level: "편의성",
    note: "짐 많고 아이 동반이면 제일 편함. 시간은 빠르지만 가격이 높음.",
  },
  {
    title: "택시",
    duration: "약 1시간 ~ 1시간 20분",
    cost: "약 AUD 150~200+",
    level: "즉시성",
    note: "바로 타기 쉽지만 우버보다 더 비싸질 수 있음.",
  },
];

const flightBookings: FlightBooking[] = [
  {
    title: "국제선 출국 1",
    route: "인천 → 시드니",
    date: "2026-06-04 ~ 2026-06-05",
    time: "21:50 출발 / 09:05 도착",
    bookingRef: "WH64VR",
    flightNo: "JQ48",
    aircraft: "보잉 787 드림라이너",
    duration: "10시간 15분",
    fromDetail: "서울(인천) / 인천국제공항 제1터미널",
    toDetail: "시드니 / 시드니 공항 T1 국제선",
    price: "₩645,000",
    passengers: [
      { name: "MRS MIYOUNG CHO", seat: "28D", cabinBag: "7kg", checkedBag: "20kg", meal: "Meal" },
      { name: "MISS HAEL JO", seat: "28C", cabinBag: "7kg", checkedBag: "20kg", meal: "Meal" },
    ],
  },
  {
    title: "국제선 출국 2",
    route: "인천 → 시드니",
    date: "2026-06-04 ~ 2026-06-05",
    time: "21:50 출발 / 09:05 도착",
    bookingRef: "CR3H4K",
    flightNo: "JQ48",
    aircraft: "보잉 787 드림라이너",
    duration: "10시간 15분",
    fromDetail: "서울(인천) / 인천국제공항 제1터미널",
    toDetail: "시드니 / 시드니 공항 T1 국제선",
    price: "₩545,400",
    passengers: [
      { name: "MR YOUNGJUNE JO", seat: "28A", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
      { name: "MSTR DAEL JO", seat: "28B", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
    ],
  },
  {
    title: "호주 국내선",
    route: "시드니 → 브리즈번",
    date: "2026-06-08",
    time: "18:25 출발 / 19:55 도착",
    bookingRef: "EHUNFY",
    flightNo: "JQ822",
    aircraft: "에어버스 A321",
    duration: "1시간 30분",
    fromDetail: "시드니 공항 T2 국내선",
    toDetail: "브리즈번 국내선 터미널",
    price: "AUD 402.42",
    passengers: [
      { name: "MR youngjune jo", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "20kg", meal: "없음" },
      { name: "MRS MIYOUNG CHO", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "20kg", meal: "없음" },
      { name: "MSTR DAEL JO", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
      { name: "MISS HAEL JO", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
    ],
  },
  {
    title: "국제선 귀국 1",
    route: "브리즈번 → 인천",
    date: "2026-06-13",
    time: "11:10 출발 / 19:55 도착",
    bookingRef: "GK1QKF",
    flightNo: "JQ53",
    aircraft: "보잉 787 드림라이너",
    duration: "9시간 45분",
    fromDetail: "브리즈번 국제선 터미널",
    toDetail: "서울(인천) / 인천국제공항 제1터미널",
    price: "AUD 580.37",
    passengers: [
      { name: "MR YOUNGJUNE JO", seat: "33J", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
      { name: "MSTR DAEL JO", seat: "33H", cabinBag: "7kg", checkedBag: "0kg", meal: "없음" },
    ],
  },
  {
    title: "국제선 귀국 2",
    route: "브리즈번 → 인천",
    date: "2026-06-13",
    time: "11:10 출발 / 19:55 도착",
    bookingRef: "HKIKPS",
    flightNo: "JQ53",
    aircraft: "보잉 787 드림라이너",
    duration: "9시간 45분",
    fromDetail: "브리즈번 국제선 터미널",
    toDetail: "서울(인천) / 인천국제공항 제1터미널",
    price: "AUD 693.61",
    passengers: [
      { name: "MRS MIYOUNG CHO", seat: "33F", cabinBag: "7kg", checkedBag: "20kg", meal: "Meal" },
      { name: "MISS HAEL JO", seat: "33G", cabinBag: "7kg", checkedBag: "20kg", meal: "Meal" },
    ],
  },
];

const stays: StayItem[] = [
  {
    city: "Sydney",
    name: "Meriton Suites Mascot Central",
    period: "6/5 ~ 6/8",
    nights: "3박",
    note: "현장 보증금 AUD 200 필요",
    address: "200 Coward Street, Mascot, NSW 2020",
    checkIn: "2026-06-05",
    checkOut: "2026-06-08",
    price: "AUD 864.50",
    bookingRef: "C15TRET7",
    phone: "+61-2-90588888",
    paymentStatus: "현장 결제/보증금 확인 필요",
  },
  {
    city: "Gold Coast",
    name: "Rhapsody Resort",
    period: "6/8 ~ 6/11",
    nights: "3박",
    note: "2 베드룸 오션뷰 아파트 / 자동 결제 예정",
    address: "3440 Surfers Paradise Boulevard, Gold Coast, QLD 4218",
    checkIn: "2026-06-08",
    checkOut: "2026-06-11",
    price: "USD 453.13",
    phone: "+61 756188300",
    email: "res@rhapsodyresort.com.au",
    paymentDue: "2026-06-01",
    paymentStatus: "자동 결제 예정",
  },
  {
    city: "Brisbane",
    name: "Brisbane One Apartments by CLLIX",
    period: "6/11 ~ 6/13",
    nights: "2박",
    note: "Two-Bedroom One Bathroom Apartment / 자동 결제 예정",
    address: "1 Cordelia Street, Brisbane, QLD 4101",
    checkIn: "2026-06-11",
    checkOut: "2026-06-13",
    price: "AUD 463.62",
    phone: "+61 738445566",
    email: "reservations@cllix.com",
    paymentDue: "2026-06-08",
    paymentStatus: "자동 결제 예정",
  },
];

const places: PlaceItem[] = [
  {
    name: "Meat in a Park",
    city: "Sydney",
    category: "BBQ / 캠핑",
    address: "11 Harbour St, Sydney NSW 2000, Australia",
    link: "https://www.meatinapark.com.au/",
    note: "BBQ 가능한 장소 모아보기용",
    lat: -33.8753,
    lon: 151.2032,
  },
  {
    name: "텀바롱 놀이터",
    city: "Sydney",
    category: "가고 싶은 장소",
    note: "달링하버 쪽",
    lat: -33.8746,
    lon: 151.2012,
  },
  {
    name: "씨월드",
    city: "Gold Coast",
    category: "관광지",
    lat: -27.9566,
    lon: 153.4268,
  },
  {
    name: "Rhapsody Resort",
    city: "Gold Coast",
    category: "숙소",
    address: "3440 Surfers Paradise Boulevard, Gold Coast, QLD 4218",
    lat: -27.9889,
    lon: 153.4294,
  },
  {
    name: "Brisbane One Apartments",
    city: "Brisbane",
    category: "숙소",
    address: "1 Cordelia Street, Brisbane, QLD 4101",
    lat: -27.4737,
    lon: 153.0135,
  },
  {
    name: "Meriton Suites Mascot Central",
    city: "Sydney",
    category: "숙소",
    address: "200 Coward Street, Mascot, NSW 2020",
    lat: -33.9242,
    lon: 151.1937,
  },
];

const checklistGroups: ChecklistGroup[] = [
  {
    title: "필수 준비물",
    emoji: "⭐",
    items: ["여권 (+사본)", "항공·호텔 바우처", "비자", "여행자보험", "로밍 or eSIM", "국제 운전 면허증", "트래블 카드", "현지 화폐", "기내용 목베개"],
  },
  {
    title: "의류",
    emoji: "🧥",
    items: ["속옷 및 양말", "잠옷 및 수면안대", "편한 옷 3벌", "겉옷", "슬리퍼", "수영복", "모자", "선글라스", "경량패딩"],
  },
  {
    title: "케어",
    emoji: "🧴",
    items: ["필터 샤워기", "스킨케어", "칫솔·치약", "폼클렌징", "샴푸·린스", "바디워시", "썬크림 / 썬스틱", "데오드란트", "위생용품", "마스크팩"],
  },
  {
    title: "전자기기",
    emoji: "🎧",
    items: ["멀티 어댑터", "각종 충전기", "보조 배터리", "노트북", "에어팟", "전기장판"],
  },
  {
    title: "비상약",
    emoji: "🧰",
    items: ["멀미약", "소화제", "타이레놀", "밴드·후시딘", "알레르기약", "모기 기피제"],
  },
  {
    title: "기타",
    emoji: "🤍",
    items: ["물티슈", "지퍼백", "컵라면·젓가락", "과도칼", "캐리어 체중계", "담요"],
  },
];

function weatherCodeToText(code?: number) {
  if (code === undefined) return "불러오는 중";
  if (code === 0) return "맑음";
  if ([1, 2, 3].includes(code)) return "구름 조금";
  if ([45, 48].includes(code)) return "안개";
  if ([51, 53, 55, 56, 57].includes(code)) return "이슬비";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "비";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "눈";
  if ([95, 96, 99].includes(code)) return "뇌우";
  return "날씨";
}

function formatKrw(value?: number | null) {
  if (!value) return "-";
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function getOsmEmbedUrl(lat: number, lon: number) {
  const d = 0.02;
  const left = lon - d;
  const right = lon + d;
  const top = lat + d;
  const bottom = lat - d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function getDDay(targetDate: string) {
  const today = new Date();
  const target = new Date(`${targetDate}T00:00:00`);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCountdownLabel(targetDate?: string, fallbackDate?: string) {
  const finalDate = targetDate || fallbackDate;
  if (!finalDate) return "일정 없음";

  const target = new Date(`${finalDate}T00:00:00`);
  const today = new Date();

  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "오늘";
  return "지남";
}

function AppCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white/95 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mt-10 mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {sub ? <p className="mt-1 text-sm text-slate-500">{sub}</p> : null}
    </div>
  );
}

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [input, setInput] = useState("");

  const [mainTab, setMainTab] = useState<MainTab>("home");
  const [audToKrw, setAudToKrw] = useState<number | null>(910);
  const [fxStatus, setFxStatus] = useState<string>("기본값 표시 중");
  const [weather, setWeather] = useState<Record<string, WeatherState>>({});
  const [openFlight, setOpenFlight] = useState<string | null>(null);
  const [openStay, setOpenStay] = useState<string | null>(null);
  const [openPlace, setOpenPlace] = useState<string | null>(null);

  const dday = getDDay("2026-06-04");
  const totalFlightCount = flightBookings.length;
  const mealIncludedCount = flightBookings
    .flatMap((f) => f.passengers)
    .filter((p) => p.meal && p.meal !== "없음").length;

  const totalFlightCost =
    645000 +
    545400 +
    402.42 * (audToKrw ?? 910) +
    580.37 * (audToKrw ?? 910) +
    693.61 * (audToKrw ?? 910);

  const totalStayCost =
    864.5 * (audToKrw ?? 910) +
    463.62 * (audToKrw ?? 910) +
    453.13 * 1300;

  const totalCost = totalFlightCost + totalStayCost;

  useEffect(() => {
    async function fetchFx() {
      try {
        setFxStatus("불러오는 중");
        const res = await fetch(
          "https://api.frankfurter.dev/v2/rates?base=AUD&quotes=KRW",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rate = data?.rates?.KRW;
        if (!rate) throw new Error("KRW rate missing");
        setAudToKrw(rate);
        setFxStatus(`업데이트 ${new Date().toLocaleTimeString("ko-KR")}`);
      } catch (error) {
        console.error("환율 불러오기 실패", error);
        setFxStatus("환율 불러오기 실패");
      }
    }

    fetchFx();
    const id = setInterval(fetchFx, 1000 * 60 * 10);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const results = await Promise.all(
          weatherCities.map(async (city) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
            const res = await fetch(url, { cache: "no-store" });
            const data = await res.json();

            return {
              key: city.key,
              value: {
                temperature: data.current.temperature_2m,
                apparent: data.current.apparent_temperature,
                wind: data.current.wind_speed_10m,
                code: data.current.weather_code,
              } as WeatherState,
            };
          })
        );

        const mapped = results.reduce<Record<string, WeatherState>>((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setWeather(mapped);
      } catch (error) {
        console.error("날씨 불러오기 실패", error);
      }
    }

    fetchWeather();
    const id = setInterval(fetchWeather, 1000 * 60 * 30);
    return () => clearInterval(id);
  }, []);

  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c1224] px-4">
        <div className="w-full max-w-sm rounded-[32px] bg-white p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
            🔐
          </div>
          <h2 className="mb-2 text-xl font-bold">여행 페이지</h2>
          <p className="mb-4 text-sm text-slate-500">가족용 비공개 페이지예요.</p>
          <input
            type="password"
            className="mb-3 w-full rounded-2xl border border-slate-200 p-3"
            placeholder="비밀번호 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (input === PASSWORD) setIsAuth(true);
              else alert("비밀번호 틀림");
            }}
            className="w-full rounded-2xl bg-slate-900 py-3 font-medium text-white"
          >
            입장
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef4ff] to-[#f7f9fc] pb-24">
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-sky-700">Travel App</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Australia Family Trip
            </h1>
          </div>
          <div className="rounded-2xl bg-slate-900 px-3 py-2 text-right text-white shadow-sm">
            <p className="text-[10px] text-slate-300">AUD / KRW</p>
            <p className="text-sm font-bold">{formatKrw(audToKrw)}</p>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {[
            { key: "home", label: "홈" },
            { key: "flights", label: "항공" },
            { key: "stays", label: "숙소" },
            { key: "places", label: "장소" },
            { key: "checklist", label: "체크" },
          ].map((item) => {
            const active = mainTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMainTab(item.key as MainTab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mb-5 hidden gap-2 md:flex">
          {[
            { key: "home", label: "홈" },
            { key: "flights", label: "항공권" },
            { key: "stays", label: "숙소" },
            { key: "places", label: "장소" },
            { key: "checklist", label: "체크리스트" },
          ].map((item) => {
            const active = mainTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMainTab(item.key as MainTab)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {mainTab === "home" && (
          <div className="space-y-5">
            <AppCard className="overflow-hidden p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">6/4 ~ 6/13</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                    시드니 · 골드코스트 · 브리즈번
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
                    항공, 숙소, 날씨, 장소, 준비물까지 앱처럼 한 번에 관리.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">출발까지</p>
                    <p className="mt-1 text-xl font-bold">{dday >= 0 ? `D-${dday}` : "여행 시작"}</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-3">
                    <p className="text-xs text-slate-500">Meal 포함</p>
                    <p className="mt-1 text-xl font-bold">{mealIncludedCount}명</p>
                  </div>
                </div>
              </div>
            </AppCard>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <AppCard className="p-4">
                <p className="text-xs text-slate-500">총 비용</p>
                <p className="mt-2 text-xl font-bold">{Math.round(totalCost).toLocaleString()}원</p>
              </AppCard>
              <AppCard className="p-4">
                <p className="text-xs text-slate-500">항공 예약</p>
                <p className="mt-2 text-xl font-bold">{totalFlightCount}건</p>
              </AppCard>
              <AppCard className="p-4">
                <p className="text-xs text-slate-500">숙소</p>
                <p className="mt-2 text-xl font-bold">{stays.length}곳</p>
              </AppCard>
              <AppCard className="p-4">
                <p className="text-xs text-slate-500">환율 상태</p>
                <p className="mt-2 text-sm font-semibold">{fxStatus}</p>
              </AppCard>
            </div>

            <SectionTitle title="오늘 확인하기" sub="핵심 정보만 빠르게 보기" />
            <div className="grid gap-3 md:grid-cols-3">
              {weatherCities.map((city) => {
                const item = weather[city.key];
                return (
                  <AppCard key={city.key} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500">{city.label}</p>
                        <p className="mt-2 text-2xl font-bold">
                          {item ? `${Math.round(item.temperature)}°C` : "--"}
                        </p>
                      </div>
                      <MiniPill>{weatherCodeToText(item?.code)}</MiniPill>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      체감 {item ? `${Math.round(item.apparent)}°C` : "--"} · 바람{" "}
                      {item ? `${Math.round(item.wind)} km/h` : "--"}
                    </p>
                  </AppCard>
                );
              })}
            </div>

            <SectionTitle title="숙소 결제 / 체크인" />
            <div className="grid gap-3 md:grid-cols-3">
              {stays.map((stay, index) => (
                <AppCard key={`${stay.name}-${index}`} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-slate-500">{stay.city}</p>
                      <h3 className="mt-1 text-lg font-bold">{stay.name}</h3>
                    </div>
                    <MiniPill>{getCountdownLabel(stay.paymentDue, stay.checkIn)}</MiniPill>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{stay.period}</p>
                  <p className="mt-1 text-sm text-slate-600">{stay.paymentStatus ?? "확인 필요"}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    기준일: {stay.paymentDue ?? stay.checkIn ?? "-"}
                  </p>
                </AppCard>
              ))}
            </div>

            <SectionTitle title="전체 일정" />
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <AppCard key={`${item.date}-${index}`} className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <MiniPill>{item.date}</MiniPill>
                    <MiniPill>{item.city}</MiniPill>
                    {item.time ? <MiniPill>{item.time}</MiniPill> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                </AppCard>
              ))}
            </div>

            <SectionTitle title="브리즈번 공항 → 골드코스트" />
            <div className="grid gap-3 md:grid-cols-3">
              {transportCompare.map((item, index) => (
                <AppCard key={`${item.title}-${index}`} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold">{item.title}</h3>
                    <MiniPill>{item.level}</MiniPill>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">소요시간: {item.duration}</p>
                  <p className="mt-1 text-sm text-slate-600">예상비용: {item.cost}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.note}</p>
                </AppCard>
              ))}
            </div>
          </div>
        )}

        {mainTab === "flights" && (
          <div className="space-y-4">
            <SectionTitle title="항공권 상세" sub="필요할 때만 펼쳐서 보기" />
            {flightBookings.map((flight, index) => {
              const isOpen = openFlight === flight.bookingRef;
              return (
                <AppCard key={`${flight.bookingRef}-${index}`}>
                  <button
                    onClick={() => setOpenFlight(isOpen ? null : flight.bookingRef)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left md:p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <MiniPill>{flight.title}</MiniPill>
                        <MiniPill>{flight.flightNo}</MiniPill>
                        <MiniPill>{flight.bookingRef}</MiniPill>
                      </div>
                      <h3 className="mt-3 text-lg font-bold">{flight.route}</h3>
                      <p className="mt-1 text-sm text-slate-600">{flight.time}</p>
                    </div>
                    <MiniPill>{isOpen ? "접기" : "펼치기"}</MiniPill>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 p-4 md:p-5">
                      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                        <p>날짜: {flight.date}</p>
                        <p>시간: {flight.time}</p>
                        <p>기종: {flight.aircraft ?? "-"}</p>
                        <p>비행시간: {flight.duration ?? "-"}</p>
                        <p>출발: {flight.fromDetail}</p>
                        <p>도착: {flight.toDetail}</p>
                        <p className="md:col-span-2">결제: {flight.price}</p>
                      </div>

                      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-[640px] w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-3 py-2 text-left">이름</th>
                              <th className="px-3 py-2 text-left">좌석</th>
                              <th className="px-3 py-2 text-left">기내수하물</th>
                              <th className="px-3 py-2 text-left">위탁수하물</th>
                              <th className="px-3 py-2 text-left">Meal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {flight.passengers.map((p, i) => (
                              <tr key={`${p.name}-${i}`} className="border-t border-slate-200">
                                <td className="px-3 py-2">{p.name}</td>
                                <td className="px-3 py-2">{p.seat ?? "-"}</td>
                                <td className="px-3 py-2">{p.cabinBag ?? "-"}</td>
                                <td className="px-3 py-2">{p.checkedBag ?? "-"}</td>
                                <td className="px-3 py-2">{p.meal ?? "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </AppCard>
              );
            })}
          </div>
        )}

        {mainTab === "stays" && (
          <div className="space-y-4">
            <SectionTitle title="숙소 상세" sub="체크인/결제 기준일도 같이 확인" />
            {stays.map((stay, index) => {
              const stayKey = `${stay.city}-${index}`;
              const isOpen = openStay === stayKey;
              return (
                <AppCard key={stayKey}>
                  <button
                    onClick={() => setOpenStay(isOpen ? null : stayKey)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left md:p-5"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <MiniPill>{stay.city}</MiniPill>
                        <MiniPill>{stay.nights}</MiniPill>
                        <MiniPill>{getCountdownLabel(stay.paymentDue, stay.checkIn)}</MiniPill>
                      </div>
                      <h3 className="mt-3 text-lg font-bold">{stay.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{stay.period}</p>
                    </div>
                    <MiniPill>{isOpen ? "접기" : "펼치기"}</MiniPill>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 p-4 text-sm text-slate-600 md:p-5">
                      <div className="grid gap-2">
                        <p>기간: {stay.period}</p>
                        {stay.checkIn ? <p>체크인: {stay.checkIn}</p> : null}
                        {stay.checkOut ? <p>체크아웃: {stay.checkOut}</p> : null}
                        {stay.price ? <p>결제금액: {stay.price}</p> : null}
                        {stay.bookingRef ? <p>예약번호: {stay.bookingRef}</p> : null}
                        {stay.phone ? <p>전화: {stay.phone}</p> : null}
                        {stay.email ? <p>이메일: {stay.email}</p> : null}
                        {stay.address ? <p>주소: {stay.address}</p> : null}
                        {stay.paymentStatus ? <p>결제상태: {stay.paymentStatus}</p> : null}
                        {stay.paymentDue ? <p>결제예정일: {stay.paymentDue}</p> : null}
                      </div>
                      <p className="mt-3 leading-6 text-slate-500">{stay.note}</p>
                    </div>
                  )}
                </AppCard>
              );
            })}
          </div>
        )}

        {mainTab === "places" && (
          <div className="space-y-5">
            <SectionTitle title="여행지 리스트" sub="카드를 누르면 바로 아래 지도 펼침" />
            {["Sydney", "Gold Coast", "Brisbane"].map((city) => {
              const cityPlaces = places.filter((p) => p.city === city);
              if (!cityPlaces.length) return null;

              return (
                <div key={city}>
                  <h3 className="mb-3 text-lg font-bold">{city}</h3>
                  <div className="space-y-3">
                    {cityPlaces.map((place, index) => {
                      const placeKey = `${place.name}-${index}`;
                      const isOpen = openPlace === placeKey;

                      return (
                        <div key={placeKey}>
                          <AppCard>
                            <button
                              onClick={() => setOpenPlace(isOpen ? null : placeKey)}
                              className="w-full p-4 text-left md:p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm text-slate-500">{place.category}</p>
                                  <h4 className="mt-1 text-lg font-bold">{place.name}</h4>
                                  {place.address ? (
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{place.address}</p>
                                  ) : null}
                                </div>
                                <MiniPill>{isOpen ? "닫기" : "보기"}</MiniPill>
                              </div>
                            </button>

                            {isOpen && (
                              <div className="border-t border-slate-200">
                                <iframe
                                  title={place.name}
                                  src={getOsmEmbedUrl(place.lat, place.lon)}
                                  className="h-[240px] w-full md:h-[360px]"
                                />
                                <div className="flex flex-wrap gap-2 p-4 md:p-5">
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                  >
                                    구글맵에서 열기
                                  </a>
                                  {place.link ? (
                                    <a
                                      href={place.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                                    >
                                      공식 사이트
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </AppCard>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {mainTab === "checklist" && (
          <div className="space-y-5">
            <SectionTitle title="준비 체크리스트" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {checklistGroups.map((group, index) => (
                <AppCard key={`${group.title}-${index}`} className="p-4 md:p-5">
                  <h3 className="text-lg font-bold">
                    {group.emoji} {group.title}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item, itemIndex) => (
                      <label
                        key={`${item}-${itemIndex}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                      >
                        <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </AppCard>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-2 py-2">
          {[
            { key: "home", label: "홈", icon: "🏠" },
            { key: "flights", label: "항공", icon: "✈️" },
            { key: "stays", label: "숙소", icon: "🏨" },
            { key: "places", label: "장소", icon: "📍" },
            { key: "checklist", label: "체크", icon: "✅" },
          ].map((item) => {
            const active = mainTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMainTab(item.key as MainTab)}
                className={`flex min-w-[62px] flex-col items-center rounded-2xl px-3 py-2 text-[11px] ${
                  active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}