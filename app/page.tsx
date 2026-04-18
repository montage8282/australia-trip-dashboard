"use client";

import { useEffect, useState } from "react";

const PASSWORD = "1234";

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-bold mt-10 mb-4">{title}</h2>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 bg-white shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [input, setInput] = useState("");

  const [audToKrw, setAudToKrw] = useState<number | null>(null);

  // 환율 가져오기
  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/AUD")
      .then((res) => res.json())
      .then((data) => {
        setAudToKrw(data.rates.KRW);
      });
  }, []);

  // 비용 계산
  const totalFlightCost =
    645000 +
    545400 +
    (402.42 * (audToKrw ?? 900)) +
    (580.37 * (audToKrw ?? 900)) +
    (693.61 * (audToKrw ?? 900));

  const totalStayCost =
    (864.5 * (audToKrw ?? 900)) +
    (463.62 * (audToKrw ?? 900)) +
    (453.13 * 1300);

  const totalCost = totalFlightCost + totalStayCost;

  // 🔐 비밀번호 화면
  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
          <h2 className="text-xl font-bold mb-4">🔐 여행 페이지</h2>
          <input
            type="password"
            className="w-full border p-2 rounded mb-3"
            placeholder="비밀번호 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (input === PASSWORD) setIsAuth(true);
              else alert("비밀번호 틀림");
            }}
            className="w-full bg-black text-white py-2 rounded"
          >
            입장
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        🇦🇺 Australia Trip Dashboard
      </h1>

      {/* 기본 정보 */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="총 일정" value="9일" />
        <StatCard label="도시" value="3곳" />
        <StatCard label="숙소" value="3개" />
        <StatCard label="항공편" value="3개" />
        <StatCard
          label="환율 (AUD → KRW)"
          value={audToKrw ? `${audToKrw.toFixed(0)}원` : "로딩중"}
        />
      </section>

      {/* 비용 */}
      <SectionTitle title="💸 여행 총 비용" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="항공 총 비용"
          value={`${Math.round(totalFlightCost).toLocaleString()}원`}
        />
        <StatCard
          label="숙소 총 비용"
          value={`${Math.round(totalStayCost).toLocaleString()}원`}
        />
        <StatCard
          label="총 합계"
          value={`${Math.round(totalCost).toLocaleString()}원`}
        />
      </div>

      {/* 일정 */}
      <SectionTitle title="📅 일정" />

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl shadow">
          Day 1 (6/5) - 시드니 도착 / 호텔 체크인
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Day 2~4 - 시드니 관광
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Day 5 - 브리즈번 이동 → 골드코스트 이동
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Day 6~8 - 골드코스트 여행
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          Day 9 - 브리즈번 → 한국 귀국
        </div>
      </div>

      {/* 지도 */}
      <SectionTitle title="🗺 지도" />

      <div className="rounded-xl overflow-hidden shadow">
        <iframe
          src="https://maps.google.com/maps?q=sydney&t=&z=10&ie=UTF8&iwloc=&output=embed"
          className="w-full h-[300px] md:h-[420px]"
        />
      </div>
    </main>
  );
}