"use client";

import { useEffect, useMemo, useState } from "react";

const PASSWORD = "1234";

type TabKey = "overview" | "transport" | "places" | "checklist";

type ScheduleItem = {
  date: string;
  city: string;
  title: string;
  time?: string;
  note: string;
};

type TransportItem = {
  route: string;
  type: string;
  note: string;
};

type TransportCompare = {
  title: string;
  duration: string;
  cost: string;
  level: string;
  note: string;
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
  time: string;
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

const transport: TransportItem[] = [
  { route: "인천 → 시드니", type: "항공", note: "JQ48 / 6월 4일 21:50 출발 / 6월 5일 09:05 도착" },
  { route: "시드니 → 브리즈번", type: "국내선 항공", note: "JQ822 / 6월 8일 18:25 출발 / 19:55 도착" },
  { route: "브리즈번 공항 → 골드코스트", type: "대중교통", note: "기차/트램 중심으로 이동 시 비용 절약 가능" },
  { route: "브리즈번 공항 → 골드코스트", type: "우버/택시", note: "짐이 많을 때 편함 / 비용은 더 높음" },
  { route: "골드코스트 → 브리즈번", type: "기차/우버", note: "6월 11일 이동 예정" },
  { route: "브리즈번 → 인천", type: "항공", note: "JQ53 / 6월 13일 11:10 출발 / 19:55 도착" },
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
    checkIn: "6/5 15:00",
    checkOut: "6/8 10:00",
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
    checkIn: "6/8 14:00",
    checkOut: "6/11 10:00",
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
    checkIn: "6/11 14:00",
    checkOut: "6/13 10:00",
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
  const target = new Date(targetDate);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCountdownLabel(targetDate?: string) {
  if (!targetDate) return "일정 없음";
  const today = new Date();
  const target = new Date(targetDate);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "오늘";
  return "지남";
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      {sub ? <p className="mt-1 text-sm text-slate-500">{sub}</p> : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur md:p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{value}</p>
      {sub ? <p className="mt-2 text-sm text-slate-500">{sub}</p> : null}
    </div>
  );
}

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [input, setInput] = useState("");

  const [tab, setTab] = useState<TabKey>("overview");
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem>(places[0]);
  const [audToKrw, setAudToKrw] = useState<number | null>(910);
  const [fxStatus, setFxStatus] = useState<string>("기본값 표시 중");
  const [weather, setWeather] = useState<Record<string, WeatherState>>({});
  const [openFlight, setOpenFlight] = useState<string | null>(null);
  const [openStay, setOpenStay] = useState<string | null>(null);

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
                time: data.current.time,
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

  const groupedPlaces = useMemo(() => {
    const map = new Map<string, PlaceItem[]>();
    for (const place of places) {
      const current = map.get(place.city) ?? [];
      current.push(place);
      map.set(place.city, current);
    }
    return Array.from(map.entries());
  }, []);

  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
          <h2 className="mb-4 text-xl font-bold">🔐 여행 페이지</h2>
          <input
            type="password"
            className="mb-3 w-full rounded border p-3"
            placeholder="비밀번호 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (input === PASSWORD) setIsAuth(true);
              else alert("비밀번호 틀림");
            }}
            className="w-full rounded bg-black py-3 text-white"
          >
            입장
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f5fb] px-4 py-5 text-slate-800 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-6 overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-sky-100 via-white to-indigo-100 p-5 shadow-sm md:mb-8 md:rounded-[36px] md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl md:h-48 md:w-48" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl md:h-40 md:w-40" />

          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-sky-700 md:text-sm">
              Australia Travel Planner
            </p>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  🇦🇺 Sydney · Gold Coast · Brisbane
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                  항공, 숙소, 장소, 이동, 체크리스트, 환율, 날씨까지 한 번에 보는 여행 대시보드.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    출발까지
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {dday >= 0 ? `D-${dday}` : "여행 시작"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                    실시간 환율
                  </p>
                  <p className="mt-1 text-lg font-bold">1 AUD ≈ {formatKrw(audToKrw)}</p>
                  <p className="mt-1 text-xs text-slate-300">{fxStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-6">
          <StatCard label="방문 도시" value="3곳" sub="Sydney / Gold Coast / Brisbane" />
          <StatCard label="총 일정" value="10일" sub="출국일부터 귀국일까지" />
          <StatCard label="항공 예약" value={`${totalFlightCount}건`} sub="예약번호별 상세 표시" />
          <StatCard label="숙소" value="3곳" sub="시드니 / 골코 / 브리즈번" />
          <StatCard label="Meal 포함" value={`${mealIncludedCount}명`} sub="탑승객 기준" />
          <StatCard label="저장된 장소" value={`${places.length}개`} sub="계속 추가 가능" />
        </section>

        <section className="mt-8">
          <SectionTitle title="🌤 실시간 도시 날씨" sub="현재 날씨 기준" />
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {weatherCities.map((city) => {
              const item = weather[city.key];
              return (
                <div key={city.key} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                  <p className="text-sm text-slate-500">{city.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {item ? `${Math.round(item.temperature)}°C` : "--"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{weatherCodeToText(item?.code)}</p>
                  <div className="mt-4 space-y-1 text-sm text-slate-500">
                    <p>체감 {item ? `${Math.round(item.apparent)}°C` : "--"}</p>
                    <p>바람 {item ? `${Math.round(item.wind)} km/h` : "--"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle title="💸 여행 총 비용" sub="현재 환율 기준 대략 계산" />
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            <StatCard label="항공 총 비용" value={`${Math.round(totalFlightCost).toLocaleString()}원`} />
            <StatCard label="숙소 총 비용" value={`${Math.round(totalStayCost).toLocaleString()}원`} />
            <StatCard label="총 합계" value={`${Math.round(totalCost).toLocaleString()}원`} />
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle title="💳 숙소 결제 카운트다운" sub="자동 결제일이나 체크 포인트를 미리 보기" />
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {stays.map((stay, index) => (
              <div key={`${stay.name}-${index}`} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{stay.city}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{stay.name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {getCountdownLabel(stay.paymentDue)}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>상태: {stay.paymentStatus ?? "확인 필요"}</p>
                  <p>결제금액: {stay.price ?? "-"}</p>
                  <p>결제일: {stay.paymentDue ?? "현장 확인"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">✈️ 항공권 상세</h2>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                Flight Detail
              </span>
            </div>

            <div className="space-y-3 md:space-y-4">
              {flightBookings.map((flight, index) => {
                const isOpen = openFlight === flight.bookingRef;

                return (
                  <div
                    key={`${flight.bookingRef}-${index}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <button
                      onClick={() => setOpenFlight(isOpen ? null : flight.bookingRef)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-100"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm text-slate-500">{flight.title}</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                            {flight.flightNo}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                            {flight.bookingRef}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-slate-900 md:text-lg">
                          {flight.route}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{flight.time}</p>
                      </div>

                      <div className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 md:text-sm">
                        {isOpen ? "접기 ▲" : "펼치기 ▼"}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-200 bg-white p-4">
                        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                          <p>날짜: {flight.date}</p>
                          <p>시간: {flight.time}</p>
                          <p>기종: {flight.aircraft ?? "-"}</p>
                          <p>비행시간: {flight.duration ?? "-"}</p>
                          <p>출발: {flight.fromDetail}</p>
                          <p>도착: {flight.toDetail}</p>
                          <p className="md:col-span-2">결제: {flight.price}</p>
                        </div>

                        {flight.note ? (
                          <p className="mt-3 text-sm leading-6 text-slate-500">{flight.note}</p>
                        ) : null}

                        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50">
                          <table className="min-w-[640px] w-full text-sm">
                            <thead className="bg-slate-100 text-slate-600">
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

                        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          체크인 오픈 예상: 출발 48시간 전
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">🏨 숙소 상세</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Stay Detail
              </span>
            </div>

            <div className="space-y-3 md:space-y-4">
              {stays.map((stay, index) => {
                const stayKey = `${stay.city}-${index}`;
                const isOpen = openStay === stayKey;

                return (
                  <div
                    key={stayKey}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <button
                      onClick={() => setOpenStay(isOpen ? null : stayKey)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-100"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm text-slate-500">{stay.city}</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                            {stay.nights}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-slate-900 md:text-lg">
                          {stay.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{stay.period}</p>
                      </div>

                      <div className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 md:text-sm">
                        {isOpen ? "접기 ▲" : "펼치기 ▼"}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-200 bg-white p-4">
                        <div className="grid gap-2 text-sm text-slate-600">
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

                        <p className="mt-3 text-sm leading-6 text-slate-500">{stay.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
            {[
              { key: "overview", label: "전체 일정" },
              { key: "transport", label: "이동" },
              { key: "places", label: "장소 + 지도" },
              { key: "checklist", label: "체크리스트" },
            ].map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key as TabKey)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          {tab === "overview" && (
            <div>
              <SectionTitle title="📅 전체 여행 일정" sub="날짜 기준으로 보기" />
              <div className="space-y-3 md:space-y-4">
                {schedule.map((item, index) => (
                  <div key={`${item.date}-${index}`} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.date}
                      </span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                        {item.city}
                      </span>
                      {item.time ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                          {item.time}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900 md:text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "transport" && (
            <div>
              <SectionTitle
                title="🚆 이동 정리"
                sub="기본 이동 목록 + 브리즈번 공항에서 골드코스트 이동 비교"
              />
              <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                {transport.map((item, index) => (
                  <div key={`${item.route}-${index}`} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                    <p className="text-sm font-medium text-slate-500">{item.type}</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 md:text-xl">{item.route}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <SectionTitle
                  title="🚕 브리즈번 공항 → 골드코스트 비교"
                  sub="가족 이동 기준으로 보기 쉽게 정리"
                />
                <div className="grid gap-3 md:grid-cols-3 md:gap-4">
                  {transportCompare.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 md:text-lg">{item.title}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {item.level}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>소요시간: {item.duration}</p>
                        <p>예상비용: {item.cost}</p>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-500">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "places" && (
            <div>
              <SectionTitle title="📍 장소 + 지도 미리보기" sub="모바일에서는 위아래, PC에서는 좌우 배치" />

              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr] xl:gap-6">
                <div className="space-y-8">
                  {groupedPlaces.map(([city, cityPlaces]) => (
                    <div key={city}>
                      <h3 className="mb-4 text-lg font-bold text-slate-900 md:text-xl">{city}</h3>
                      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                        {cityPlaces.map((place, index) => (
                          <button
                            key={`${place.name}-${index}`}
                            onClick={() => setSelectedPlace(place)}
                            className={`rounded-3xl border p-4 text-left shadow-sm transition md:p-5 ${
                              selectedPlace.name === place.name
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                selectedPlace.name === place.name ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {place.category}
                            </p>
                            <h4 className="mt-1 text-base font-bold md:text-lg">{place.name}</h4>
                            {place.address ? (
                              <p
                                className={`mt-3 text-sm leading-6 ${
                                  selectedPlace.name === place.name ? "text-slate-200" : "text-slate-600"
                                }`}
                              >
                                {place.address}
                              </p>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="xl:sticky xl:top-8">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-4 md:p-5">
                      <p className="text-sm text-slate-500">{selectedPlace.category}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900 md:text-xl">{selectedPlace.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {selectedPlace.address ?? selectedPlace.city}
                      </p>
                    </div>

                    <iframe
                      title={selectedPlace.name}
                      src={getOsmEmbedUrl(selectedPlace.lat, selectedPlace.lon)}
                      className="h-[260px] w-full md:h-[420px]"
                    />

                    <div className="flex flex-wrap gap-2 p-4 md:p-5">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                      >
                        구글맵에서 열기
                      </a>
                      {selectedPlace.link ? (
                        <a
                          href={selectedPlace.link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          공식 사이트
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "checklist" && (
            <div>
              <SectionTitle title="🧳 여행 준비 체크리스트" sub="모바일에서도 한 항목씩 보기 쉽게 정리" />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
                {checklistGroups.map((group, index) => (
                  <div key={`${group.title}-${index}`} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
                    <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                      {group.emoji} {group.title}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {group.items.map((item, itemIndex) => (
                        <label
                          key={`${item}-${itemIndex}`}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                        >
                          <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                          <span className="text-sm text-slate-700 md:text-base">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}