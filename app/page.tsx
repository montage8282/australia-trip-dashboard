"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "1234";
const FIXED_AUD_TO_KRW = 1050;
const FIXED_USD_TO_KRW = 1467;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type MainTab = "home" | "flights" | "stays" | "places" | "checklist";

type PlaceItem = {
  id?: string;
  name: string;
  city: string;
  category: string;
  address?: string;
  link?: string;
  note?: string;
  lat?: number;
  lon?: number;
  isDb?: boolean;
};

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

type ChecklistDbItem = {
  id: string;
  group_name: string;
  item: string;
  checked: boolean;
};

type ChecklistGroupDef = {
  title: string;
  emoji: string;
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

const cityMyMaps: Record<string, string> = {
  Sydney: "https://maps.app.goo.gl/rQXLYPk2j9FijCeZA",
  Brisbane: "https://maps.app.goo.gl/avrS2JfWevifVzXV8",
  "Gold Coast": "https://maps.app.goo.gl/88kNGmMvmh1GXhKZ8",
};

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
  { title: "기차 + 트램", duration: "약 1시간 40분 ~ 2시간 10분", cost: "약 AUD 20~30", level: "가성비", note: "짐이 아주 많지 않으면 가장 무난. 비용 절약에 유리." },
  { title: "우버", duration: "약 1시간 ~ 1시간 20분", cost: "약 AUD 120~180", level: "편의성", note: "짐 많고 아이 동반이면 제일 편함. 시간은 빠르지만 가격이 높음." },
  { title: "택시", duration: "약 1시간 ~ 1시간 20분", cost: "약 AUD 150~200+", level: "즉시성", note: "바로 타기 쉽지만 우버보다 더 비싸질 수 있음." },
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
    price: "₩652,293",
    passengers: [
      { name: "MRS MIYOUNG CHO", seat: "28D", cabinBag: "7kg", checkedBag: "30kg", meal: "Meal" },
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
    price: "₩551,565",
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
    price: "₩436,799",
    passengers: [
      { name: "MR youngjune jo", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "20kg", meal: "없음" },
      { name: "MRS MIYOUNG CHO", seat: "좌석 선택", cabinBag: "7kg", checkedBag: "30kg", meal: "없음" },
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
    price: "₩629,939",
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
    price: "₩752,857",
    passengers: [
      { name: "MRS MIYOUNG CHO", seat: "33F", cabinBag: "7kg", checkedBag: "30kg", meal: "Meal" },
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

const defaultPlaces: PlaceItem[] = [
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
    category: "놀이터",
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

const checklistGroupDefs: ChecklistGroupDef[] = [
  { title: "필수 준비물", emoji: "⭐" },
  { title: "기타", emoji: "🧥" },
  { title: "케어", emoji: "🧴" },
  { title: "전자기기", emoji: "🎧" },
  { title: "비상약", emoji: "🧰" },
  { title: "다이소", emoji: "🤍" },
];

const defaultChecklistItems: { group_name: string; item: string }[] = [
  { group_name: "필수 준비물", item: "여권" },
  { group_name: "필수 준비물", item: "항공·호텔 바우처" },
  { group_name: "필수 준비물", item: "비자" },
  { group_name: "필수 준비물", item: "여행자보험" },
  { group_name: "필수 준비물", item: "로밍 or eSIM" },
  { group_name: "필수 준비물", item: "국제 운전 면허증" },
  { group_name: "필수 준비물", item: "트래블 카드" },
  { group_name: "필수 준비물", item: "현지 화폐" },
  { group_name: "필수 준비물", item: "기내용 목베개" },
  { group_name: "기타", item: "우산" },
  { group_name: "기타", item: "가습마스크" },
  { group_name: "기타", item: "겉옷" },
  { group_name: "기타", item: "슬리퍼" },
  { group_name: "기타", item: "수영복" },
  { group_name: "기타", item: "모자" },
  { group_name: "기타", item: "선글라스" },
  { group_name: "기타", item: "경량패딩" },
  { group_name: "케어", item: "필터 샤워기" },
  { group_name: "케어", item: "스킨케어" },
  { group_name: "케어", item: "칫솔·치약" },
  { group_name: "케어", item: "폼클렌징" },
  { group_name: "케어", item: "샴푸·린스" },
  { group_name: "케어", item: "바디워시" },
  { group_name: "케어", item: "썬크림 / 썬스틱" },
  { group_name: "케어", item: "위생용품" },
  { group_name: "케어", item: "마스크팩" },
  { group_name: "전자기기", item: "멀티 어댑터" },
  { group_name: "전자기기", item: "각종 충전기" },
  { group_name: "전자기기", item: "보조 배터리" },
  { group_name: "전자기기", item: "노트북" },
  { group_name: "전자기기", item: "에어팟" },
  { group_name: "전자기기", item: "전기장판" },
  { group_name: "비상약", item: "멀미약" },
  { group_name: "비상약", item: "소화제" },
  { group_name: "비상약", item: "타이레놀" },
  { group_name: "비상약", item: "밴드·후시딘" },
  { group_name: "비상약", item: "알레르기약" },
  { group_name: "비상약", item: "모기 기피제" },
  { group_name: "다이소", item: "물티슈" },
  { group_name: "다이소", item: "지퍼백" },
  { group_name: "다이소", item: "컵라면·젓가락" },
  { group_name: "다이소", item: "과도칼" },
  { group_name: "다이소", item: "담요" },
  { group_name: "다이소", item: "돗자리" },
];

// ─── 유틸 함수 ──────────────────────────────────────────────

function weatherCodeToText(code?: number) {
  if (code === undefined) return "불러오는 중";
  if (code === 0) return "맑음 ☀️";
  if ([1, 2, 3].includes(code)) return "구름 조금 ⛅";
  if ([45, 48].includes(code)) return "안개 🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "이슬비 🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "비 🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "눈 ❄️";
  if ([95, 96, 99].includes(code)) return "뇌우 ⛈️";
  return "날씨 🌈";
}

function formatKrw(value?: number | null) {
  if (!value) return "-";
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function formatAud(value: number) {
  return `AUD ${value.toFixed(2)}`;
}

function formatUsd(value: number) {
  return `USD ${value.toFixed(2)}`;
}

function getOsmEmbedUrl(lat: number, lon: number) {
  const d = 0.02;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function getGoogleMapUrl(place: PlaceItem) {
  if (place.link) return place.link;
  if (place.lat && place.lon) return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address ?? ""}`)}`;
}

function getDDay(targetDate: string) {
  const today = new Date();
  const target = new Date(`${targetDate}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getCountdownLabel(targetDate?: string, fallbackDate?: string) {
  const finalDate = targetDate || fallbackDate;
  if (!finalDate) return "일정 없음";
  const diff = Math.ceil((new Date(`${finalDate}T00:00:00`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "오늘";
  return "지남";
}

// ─── 컴포넌트 ────────────────────────────────────────────────

function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: "slate" | "sky" | "emerald" | "amber" | "rose" | "violet" }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    sky: "bg-sky-100 text-sky-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4 mt-8">
      <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

// ─── 메인 앱 ─────────────────────────────────────────────────

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [input, setInput] = useState("");
  const [mainTab, setMainTab] = useState<MainTab>("home");

  const audToKrw = FIXED_AUD_TO_KRW;
  const usdToKrw = FIXED_USD_TO_KRW;

  const [weather, setWeather] = useState<Record<string, WeatherState>>({});
  const [openFlight, setOpenFlight] = useState<string | null>(null);
  const [openStay, setOpenStay] = useState<string | null>(null);
  const [openPlace, setOpenPlace] = useState<string | null>(null);
  const [showCostDetail, setShowCostDetail] = useState(false);

  // Places
  const [dbPlaces, setDbPlaces] = useState<PlaceItem[]>([]);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCity, setNewPlaceCity] = useState("Sydney");
  const [newPlaceCategory, setNewPlaceCategory] = useState("가고 싶은 장소");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");
  const [newPlaceLink, setNewPlaceLink] = useState("");
  const [newPlaceMemo, setNewPlaceMemo] = useState("");
  const [placeStatus, setPlaceStatus] = useState("");
  const [placeFilterCity, setPlaceFilterCity] = useState<string>("전체");
  const [placeFilterCategory, setPlaceFilterCategory] = useState<string>("전체");

  // Checklist
  const [checklistItems, setChecklistItems] = useState<ChecklistDbItem[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [addingGroup, setAddingGroup] = useState<string | null>(null);

  const allPlaces = [...defaultPlaces, ...dbPlaces];

  // 카테고리 목록 동적 추출
  const allCategories = ["전체", ...Array.from(new Set(allPlaces.map((p) => p.category)))];
  const allCities = ["전체", "Sydney", "Gold Coast", "Brisbane"];

  const filteredPlaces = allPlaces.filter((p) => {
    const cityOk = placeFilterCity === "전체" || p.city === placeFilterCity;
    const catOk = placeFilterCategory === "전체" || p.category === placeFilterCategory;
    return cityOk && catOk;
  });

  const dday = getDDay("2026-06-04");
  const mealIncludedCount = flightBookings.flatMap((f) => f.passengers).filter((p) => p.meal && p.meal !== "없음").length;

  const flightCostItems = [
    { label: "국제선 출국 1", krw: 652293, original: "KRW 652,293" },
    { label: "국제선 출국 2", krw: 551565, original: "KRW 551,565" },
    { label: "호주 국내선", krw: 436799, original: "KRW 436,799" },
    { label: "국제선 귀국 1", krw: 629939, original: "KRW 629,939" },
    { label: "국제선 귀국 2", krw: 752857, original: "KRW 752,857" },
  ];

  const stayCostItems = [
    { label: "Meriton Suites Mascot Central", krw: 864.5 * audToKrw, original: formatAud(864.5) },
    { label: "Rhapsody Resort", krw: 453.13 * usdToKrw, original: formatUsd(453.13) },
    { label: "Brisbane One Apartments by CLLIX", krw: 463.62 * audToKrw, original: formatAud(463.62) },
  ];

  const totalFlightCost = flightCostItems.reduce((s, i) => s + i.krw, 0);
  const totalStayCost = stayCostItems.reduce((s, i) => s + i.krw, 0);
  const totalCost = totalFlightCost + totalStayCost;

  // ─── Supabase: 장소 ──────────────────────────────────────
  async function fetchDbPlaces() {
    const { data, error } = await supabase.from("places").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setDbPlaces(
      (data ?? []).map((item) => ({
        id: item.id,
        name: item.name ?? "",
        city: item.city ?? "Sydney",
        category: item.category ?? "가고 싶은 장소",
        address: item.address ?? "",
        link: item.map_url ?? "",
        note: item.memo ?? "",
        isDb: true,
      }))
    );
  }

  async function addDbPlace() {
    if (!newPlaceName.trim()) { setPlaceStatus("장소명을 입력해줘"); return; }
    setPlaceStatus("저장 중...");
    const { error } = await supabase.from("places").insert({
      name: newPlaceName.trim(),
      city: newPlaceCity,
      category: newPlaceCategory.trim() || "가고 싶은 장소",
      address: newPlaceAddress.trim(),
      map_url: newPlaceLink.trim(),
      memo: newPlaceMemo.trim(),
    });
    if (error) { setPlaceStatus("저장 실패"); return; }
    setNewPlaceName(""); setNewPlaceAddress(""); setNewPlaceLink(""); setNewPlaceMemo("");
    setPlaceStatus("✓ 저장 완료");
    fetchDbPlaces();
  }

  async function deleteDbPlace(id?: string) {
    if (!id) return;
    if (!window.confirm("이 장소를 삭제할까요?")) return;
    await supabase.from("places").delete().eq("id", id);
    setPlaceStatus("삭제 완료");
    fetchDbPlaces();
  }

  // ─── Supabase: 체크리스트 ────────────────────────────────
  async function fetchChecklistItems() {
    setChecklistLoading(true);
    const { data, error } = await supabase.from("checklist_items").select("*").order("created_at", { ascending: true });
    if (error) { console.error(error); setChecklistLoading(false); return; }

    if (!data || data.length === 0) {
      await supabase.from("checklist_items").insert(defaultChecklistItems.map((item) => ({ ...item, checked: false })));
      const { data: refetched } = await supabase.from("checklist_items").select("*").order("created_at", { ascending: true });
      setChecklistItems((refetched ?? []) as ChecklistDbItem[]);
    } else {
      setChecklistItems(data as ChecklistDbItem[]);
    }
    setChecklistLoading(false);
  }

  async function toggleChecklistItem(id: string, currentValue: boolean) {
    setChecklistItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !currentValue } : item));
    const { error } = await supabase.from("checklist_items").update({ checked: !currentValue }).eq("id", id);
    if (error) {
      setChecklistItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: currentValue } : item));
    }
  }

  // ✅ 버그 수정: insert 후 refetch로 정확한 DB 상태 반영
  async function addChecklistItem(groupTitle: string) {
    const text = (newItemText[groupTitle] ?? "").trim();
    if (!text) return;

    const { error } = await supabase
      .from("checklist_items")
      .insert({ group_name: groupTitle, item: text, checked: false });

    if (error) { console.error("항목 추가 실패:", error); return; }

    // 성공하면 전체 refetch로 DB 상태와 동기화
    setNewItemText((prev) => ({ ...prev, [groupTitle]: "" }));
    setAddingGroup(null);
    await fetchChecklistItems();
  }

  async function deleteChecklistItem(id: string) {
    if (!window.confirm("이 항목을 삭제할까요?")) return;
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
    const { error } = await supabase.from("checklist_items").delete().eq("id", id);
    if (error) { fetchChecklistItems(); }
  }

  // ─── 날씨 ────────────────────────────────────────────────
  useEffect(() => {
    fetchDbPlaces();
    fetchChecklistItems();

    async function fetchWeather() {
      try {
        const results = await Promise.all(
          weatherCities.map(async (city) => {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
              { cache: "no-store" }
            );
            const data = await res.json();
            return { key: city.key, value: { temperature: data.current.temperature_2m, apparent: data.current.apparent_temperature, wind: data.current.wind_speed_10m, code: data.current.weather_code } as WeatherState };
          })
        );
        setWeather(results.reduce<Record<string, WeatherState>>((acc, i) => { acc[i.key] = i.value; return acc; }, {}));
      } catch (e) { console.error(e); }
    }

    fetchWeather();
    const id = setInterval(fetchWeather, 1000 * 60 * 30);
    return () => clearInterval(id);
  }, []);

  // ─── 로그인 화면 ─────────────────────────────────────────
  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl">🦘</div>
              <h2 className="text-2xl font-bold text-slate-900">Australia Trip</h2>
              <p className="mt-1 text-sm text-slate-400">가족 전용 여행 플래너</p>
            </div>
            <input
              type="password"
              className="mb-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
              placeholder="비밀번호 입력"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && input === PASSWORD) setIsAuth(true); }}
            />
            <button
              onClick={() => { if (input === PASSWORD) setIsAuth(true); else alert("비밀번호가 틀렸어요"); }}
              className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              입장하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const tabs = [
    { key: "home", label: "홈", icon: "🏠" },
    { key: "flights", label: "항공", icon: "✈️" },
    { key: "stays", label: "숙소", icon: "🏨" },
    { key: "places", label: "장소", icon: "📍" },
    { key: "checklist", label: "체크", icon: "✅" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm">🦘</div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">Australia Family Trip</p>
              <p className="text-[10px] text-slate-400">6/4 ~ 6/13 · 10일</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-right">
              <p className="text-[9px] text-slate-500 leading-tight">AUD</p>
              <p className="text-xs font-bold text-slate-800">{formatKrw(audToKrw)}</p>
            </div>
            {dday >= 0 ? (
              <div className="rounded-xl bg-sky-500 px-3 py-1.5 text-center">
                <p className="text-[9px] text-sky-100 leading-tight">출발</p>
                <p className="text-xs font-bold text-white">D-{dday}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* 탭 */}
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {tabs.map((tab) => {
            const active = mainTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key as MainTab)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-5">

        {/* ═══ 홈 탭 ═══════════════════════════════════════════ */}
        {mainTab === "home" && (
          <div className="space-y-6">

            {/* 히어로 카드 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-lg">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-sky-400/20" />
              <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">Family Vacation 2026</p>
              <h1 className="mt-2 text-2xl font-bold leading-snug">
                시드니 · 골드코스트<br />브리즈번
              </h1>
              <p className="mt-1 text-sm text-slate-400">Jun 4 – Jun 13 · 10일간의 여행</p>

              <div className="mt-5 flex gap-3">
                <div className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[10px] text-slate-400">Meal 포함</p>
                  <p className="mt-0.5 text-xl font-bold">{mealIncludedCount}명</p>
                </div>
                <div className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[10px] text-slate-400">항공편</p>
                  <p className="mt-0.5 text-xl font-bold">{flightBookings.length}건</p>
                </div>
                <div className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[10px] text-slate-400">숙소</p>
                  <p className="mt-0.5 text-xl font-bold">{stays.length}곳</p>
                </div>
              </div>
            </div>

            {/* 총 비용 */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">총 예약 비용 (항공 + 숙소)</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{Math.round(totalCost).toLocaleString()}원</p>
                </div>
                <button
                  onClick={() => setShowCostDetail(!showCostDetail)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  {showCostDetail ? "닫기" : "상세"}
                </button>
              </div>

              {showCostDetail && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">✈️ 항공권</p>
                    <div className="space-y-1.5">
                      {flightCostItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                          <p className="text-xs text-slate-600">{item.label}</p>
                          <p className="text-xs font-bold text-slate-900">{formatKrw(item.krw)}</p>
                        </div>
                      ))}
                      <div className="flex justify-between rounded-xl bg-slate-900 px-3 py-2.5">
                        <p className="text-xs text-slate-300">소계</p>
                        <p className="text-xs font-bold text-white">{formatKrw(totalFlightCost)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">🏨 숙소</p>
                    <div className="space-y-1.5">
                      {stayCostItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                          <p className="text-xs text-slate-600">{item.label}</p>
                          <p className="text-xs font-bold text-slate-900">{formatKrw(item.krw)}</p>
                        </div>
                      ))}
                      <div className="flex justify-between rounded-xl bg-slate-900 px-3 py-2.5">
                        <p className="text-xs text-slate-300">소계</p>
                        <p className="text-xs font-bold text-white">{formatKrw(totalStayCost)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 날씨 */}
            <SectionHeader title="현재 날씨" sub="30분마다 자동 업데이트" />
            <div className="grid grid-cols-3 gap-3">
              {weatherCities.map((city) => {
                const item = weather[city.key];
                return (
                  <Card key={city.key} className="p-4">
                    <p className="text-xs font-medium text-slate-500">{city.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{item ? `${Math.round(item.temperature)}°` : "--"}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{weatherCodeToText(item?.code)}</p>
                    <p className="mt-1 text-[10px] text-slate-400">체감 {item ? `${Math.round(item.apparent)}°` : "--"}</p>
                  </Card>
                );
              })}
            </div>

            {/* 숙소 결제 현황 */}
            <SectionHeader title="숙소 결제 현황" />
            <div className="space-y-3">
              {stays.map((stay, i) => (
                <Card key={i} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xs text-slate-400">{stay.city}</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">{stay.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{stay.paymentStatus}</p>
                  </div>
                  <Badge color={stay.paymentDue ? "amber" : "sky"}>{getCountdownLabel(stay.paymentDue, stay.checkIn)}</Badge>
                </Card>
              ))}
            </div>

            {/* 전체 일정 */}
            <SectionHeader title="전체 일정" />
            <div className="space-y-2">
              {schedule.map((item, i) => (
                <Card key={i} className="flex gap-4 p-4">
                  <div className="shrink-0 text-center">
                    <p className="text-sm font-bold text-slate-900">{item.date}</p>
                    {item.time && <p className="mt-0.5 text-[10px] text-slate-400">{item.time}</p>}
                  </div>
                  <div className="h-full w-px bg-slate-100 self-stretch" />
                  <div>
                    <p className="text-[10px] font-medium text-sky-600">{item.city}</p>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.note}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* 브리즈번 공항 → 골드코스트 이동 */}
            <SectionHeader title="브리즈번 공항 → 골드코스트" sub="입국 당일 이동 수단 비교" />
            <div className="space-y-3">
              {transportCompare.map((item, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <Badge color={i === 0 ? "emerald" : i === 1 ? "sky" : "slate"}>{item.level}</Badge>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-slate-500">
                    <span>⏱ {item.duration}</span>
                    <span>💰 {item.cost}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{item.note}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 항공 탭 ════════════════════════════════════════ */}
        {mainTab === "flights" && (
          <div className="space-y-3">
            <SectionHeader title="항공권 예약 상세" sub="카드를 눌러 탑승 정보 확인" />
            {flightBookings.map((flight, index) => {
              const isOpen = openFlight === flight.bookingRef;
              return (
                <Card key={flight.bookingRef}>
                  <button
                    onClick={() => setOpenFlight(isOpen ? null : flight.bookingRef)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge color="slate">{flight.title}</Badge>
                          <Badge color="sky">{flight.flightNo}</Badge>
                          <Badge color="violet">{flight.bookingRef}</Badge>
                        </div>
                        <p className="mt-2.5 text-base font-bold text-slate-900">{flight.route}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{flight.time}</p>
                      </div>
                      <span className="mt-1 shrink-0 text-slate-400">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 p-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                        <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">날짜</span><br />{flight.date}</div>
                        <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">기종</span><br />{flight.aircraft ?? "-"}</div>
                        <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">비행시간</span><br />{flight.duration ?? "-"}</div>
                        <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">결제금액</span><br /><span className="font-bold text-slate-900">{flight.price}</span></div>
                        <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">출발</span><br />{flight.fromDetail}</div>
                        <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">도착</span><br />{flight.toDetail}</div>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full min-w-[540px] text-xs">
                          <thead className="bg-slate-50">
                            <tr>
                              {["이름", "좌석", "기내수하물", "위탁수하물", "Meal"].map((h) => (
                                <th key={h} className="px-3 py-2.5 text-left font-semibold text-slate-600">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {flight.passengers.map((p, i) => (
                              <tr key={i} className="border-t border-slate-100">
                                <td className="px-3 py-2.5 font-medium">{p.name}</td>
                                <td className="px-3 py-2.5">{p.seat ?? "-"}</td>
                                <td className="px-3 py-2.5">{p.cabinBag ?? "-"}</td>
                                <td className="px-3 py-2.5">{p.checkedBag ?? "-"}</td>
                                <td className="px-3 py-2.5">{p.meal ?? "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══ 숙소 탭 ════════════════════════════════════════ */}
        {mainTab === "stays" && (
          <div className="space-y-3">
            <SectionHeader title="숙소 예약 상세" sub="결제일 / 체크인 / 연락처 확인" />
            {stays.map((stay, index) => {
              const stayKey = `${stay.city}-${index}`;
              const isOpen = openStay === stayKey;
              return (
                <Card key={stayKey}>
                  <button onClick={() => setOpenStay(isOpen ? null : stayKey)} className="w-full p-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge color="sky">{stay.city}</Badge>
                          <Badge color="slate">{stay.nights}</Badge>
                          <Badge color="amber">{getCountdownLabel(stay.paymentDue, stay.checkIn)}</Badge>
                        </div>
                        <p className="mt-2.5 text-base font-bold text-slate-900">{stay.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{stay.period}</p>
                      </div>
                      <span className="mt-1 shrink-0 text-slate-400">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 p-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        {stay.checkIn && <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">체크인</span><br />{stay.checkIn}</div>}
                        {stay.checkOut && <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">체크아웃</span><br />{stay.checkOut}</div>}
                        {stay.price && <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">결제금액</span><br /><span className="font-bold text-slate-900">{stay.price}</span></div>}
                        {stay.bookingRef && <div className="rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">예약번호</span><br />{stay.bookingRef}</div>}
                        {stay.paymentStatus && <div className="col-span-2 rounded-xl bg-amber-50 p-2.5"><span className="text-amber-500">결제상태</span><br />{stay.paymentStatus}</div>}
                        {stay.paymentDue && <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">결제예정일</span><br />{stay.paymentDue}</div>}
                        {stay.phone && <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">전화</span><br />{stay.phone}</div>}
                        {stay.email && <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">이메일</span><br />{stay.email}</div>}
                        {stay.address && <div className="col-span-2 rounded-xl bg-slate-50 p-2.5"><span className="text-slate-400">주소</span><br />{stay.address}</div>}
                      </div>
                      <p className="mt-3 text-xs text-slate-400">{stay.note}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══ 장소 탭 ════════════════════════════════════════ */}
        {mainTab === "places" && (
          <div className="space-y-5">

            {/* 구글 My Maps 링크 */}
            <SectionHeader title="구글 내 지도" sub="도시별 지도를 한눈에 — 아래 버튼을 눌러 열기" />
            <div className="grid grid-cols-3 gap-3">
              {[
                { city: "Sydney", emoji: "🌉", label: "시드니" },
                { city: "Gold Coast", emoji: "🏖️", label: "골드코스트" },
                { city: "Brisbane", emoji: "🌿", label: "브리즈번" },
              ].map(({ city, emoji, label }) => (
                <a
                  key={city}
                  href={cityMyMaps[city]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-4 text-center shadow-sm transition hover:shadow-md hover:border-sky-300 hover:bg-sky-50"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-bold text-slate-800">{label}</span>
                  <span className="text-[10px] text-sky-500 font-medium">지도 열기 ↗</span>
                </a>
              ))}
            </div>

            {/* 장소 추가 폼 */}
            <SectionHeader title="장소 추가" sub="가족 누구나 바로 추가할 수 있어요" />
            <Card className="p-4">
              <div className="grid gap-2.5 md:grid-cols-2">
                <input value={newPlaceName} onChange={(e) => setNewPlaceName(e.target.value)} placeholder="장소명 *" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                <select value={newPlaceCity} onChange={(e) => setNewPlaceCity(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                  <option value="Sydney">Sydney</option>
                  <option value="Gold Coast">Gold Coast</option>
                  <option value="Brisbane">Brisbane</option>
                </select>
                <input value={newPlaceCategory} onChange={(e) => setNewPlaceCategory(e.target.value)} placeholder="카테고리 (예: 레스토랑, 놀이터)" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                <input value={newPlaceAddress} onChange={(e) => setNewPlaceAddress(e.target.value)} placeholder="주소" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                <input value={newPlaceLink} onChange={(e) => setNewPlaceLink(e.target.value)} placeholder="구글맵 링크" className="col-span-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                <input value={newPlaceMemo} onChange={(e) => setNewPlaceMemo(e.target.value)} placeholder="메모" className="col-span-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={addDbPlace} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">장소 추가</button>
                {placeStatus && <p className="text-xs text-slate-500">{placeStatus}</p>}
              </div>
            </Card>

            {/* 필터 */}
            <SectionHeader title="장소 리스트" sub="카테고리와 도시로 필터링" />
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <p className="self-center text-xs text-slate-400 mr-1">도시</p>
                {allCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setPlaceFilterCity(city)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      placeFilterCity === city ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <p className="self-center text-xs text-slate-400 mr-1">카테고리</p>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlaceFilterCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      placeFilterCategory === cat ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">{filteredPlaces.length}개의 장소</p>
            </div>

            {/* 장소 카드 */}
            <div className="space-y-2">
              {filteredPlaces.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-400">해당 필터에 맞는 장소가 없어요</div>
              )}
              {filteredPlaces.map((place, index) => {
                const placeKey = `${place.id ?? place.name}-${index}`;
                const isOpen = openPlace === placeKey;
                const hasMap = typeof place.lat === "number" && typeof place.lon === "number";

                return (
                  <Card key={placeKey}>
                    <button onClick={() => setOpenPlace(isOpen ? null : placeKey)} className="w-full p-4 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap gap-1.5">
                            <Badge color="sky">{place.city}</Badge>
                            <Badge color="slate">{place.category}</Badge>
                            {place.isDb && <Badge color="emerald">추가됨</Badge>}
                          </div>
                          <p className="mt-2 text-sm font-bold text-slate-900">{place.name}</p>
                          {place.address && <p className="mt-0.5 text-xs text-slate-500">{place.address}</p>}
                          {place.note && <p className="mt-0.5 text-xs text-slate-400">{place.note}</p>}
                        </div>
                        <span className="mt-1 shrink-0 text-slate-400">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100">
                        {hasMap ? (
                          <iframe
                            title={place.name}
                            src={getOsmEmbedUrl(place.lat!, place.lon!)}
                            className="h-[220px] w-full"
                          />
                        ) : (
                          <p className="px-4 py-3 text-xs text-slate-400">직접 추가한 장소 — 구글맵 링크로 열기</p>
                        )}
                        <div className="flex flex-wrap gap-2 p-4">
                          <a href={getGoogleMapUrl(place)} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white">구글맵 열기 ↗</a>
                          {cityMyMaps[place.city] && (
                            <a href={cityMyMaps[place.city]} target="_blank" rel="noreferrer" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700">내 지도 열기 ↗</a>
                          )}
                          {place.isDb && (
                            <button onClick={() => deleteDbPlace(place.id)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600">삭제</button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ 체크리스트 탭 ══════════════════════════════════ */}
        {mainTab === "checklist" && (
          <div className="space-y-5">
            <SectionHeader title="준비 체크리스트" sub="체크하면 모든 기기에서 실시간 저장" />

            {/* 전체 진행률 */}
            {!checklistLoading && (() => {
              const total = checklistItems.length;
              const checked = checklistItems.filter((i) => i.checked).length;
              const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
              return (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-slate-900">전체 진행률</p>
                    <p className="text-sm font-bold text-sky-600">{pct}%</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{checked} / {total} 완료</p>
                </Card>
              );
            })()}

            {checklistLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 text-sm">불러오는 중...</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {checklistGroupDefs.map((group) => {
                  const groupItems = checklistItems.filter((item) => item.group_name === group.title);
                  const checkedCount = groupItems.filter((i) => i.checked).length;
                  const isAddingHere = addingGroup === group.title;
                  const allDone = groupItems.length > 0 && checkedCount === groupItems.length;

                  return (
                    <Card key={group.title} className={`p-4 ${allDone ? "ring-1 ring-emerald-200" : ""}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900">{group.emoji} {group.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${allDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {checkedCount}/{groupItems.length}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {groupItems.map((item) => (
                          <div
                            key={item.id}
                            className="group flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleChecklistItem(item.id, item.checked)}
                              className="h-4 w-4 shrink-0 accent-slate-900 cursor-pointer"
                            />
                            <span className={`flex-1 text-xs ${item.checked ? "text-slate-400 line-through" : "text-slate-700"}`}>
                              {item.item}
                            </span>
                            <button
                              onClick={() => deleteChecklistItem(item.id)}
                              className="shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-400 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {isAddingHere ? (
                        <div className="mt-2.5 flex gap-2">
                          <input
                            autoFocus
                            value={newItemText[group.title] ?? ""}
                            onChange={(e) => setNewItemText((prev) => ({ ...prev, [group.title]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addChecklistItem(group.title);
                              if (e.key === "Escape") setAddingGroup(null);
                            }}
                            placeholder="항목 입력 후 Enter"
                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-400"
                          />
                          <button onClick={() => addChecklistItem(group.title)} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">추가</button>
                          <button onClick={() => setAddingGroup(null)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500">취소</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingGroup(group.title)}
                          className="mt-2.5 w-full rounded-xl border border-dashed border-slate-200 py-2 text-xs text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors"
                        >
                          + 항목 추가
                        </button>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 모바일 하단 탭바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
          {tabs.map((item) => {
            const active = mainTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setMainTab(item.key as MainTab)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition-colors ${
                  active ? "bg-slate-900 text-white" : "text-slate-500"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
