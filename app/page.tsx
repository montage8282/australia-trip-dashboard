"use client";

import { useEffect, useState } from "react";

const PASSWORD = "1234";

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-bold mt-10 mb-4">{title}</h2>;
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
    <div className="rounded-2xl border p-4 bg-white shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub ? <p className="mt-1 text-sm text-gray-500">{sub}</p> : null}
    </div>
  );
}

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [input, setInput] = useState("");

  const [audToKrw, setAudToKrw] = useState<number | null>(null);
  const [fxStatus, setFxStatus] = useState("불러오는 중");

  useEffect(() => {
    async function fetchRate() {
      try {
        setFxStatus("불러오는 중");
        const res = await fetch(
          "https://api.frankfurter.dev/v1/latest?base=AUD&symbols=KRW",
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const rate = data?.rates?.KRW;

        if (!rate) {
          throw new Error("KRW rate missing");
        }

        setAudToKrw(rate);
        setFxStatus(`업데이트 ${new Date().toLocaleTimeString("ko-KR")}`);
      } catch (error) {
        console.error("환율 불러오기 실패:", error);
        setFxStatus("환율 불러오기 실패");
      }
    }

    fetchRate();
  }, []);

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

  if (!isAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
          <h2 className="mb-4 text-xl font-bold">🔐 여행 페이지</h2>
          <input
            type="password"
            className="mb-3 w-full rounded border p-2"
            placeholder="비밀번호 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => {
              if (input === PASSWORD) setIsAuth(true);
              else alert("비밀번호 틀림");
            }}
            className="w-full rounded bg-black py-2 text-white"
          >
            입장
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        🇦🇺 Australia Trip Dashboard
      </h1>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="총 일정" value="9일" />
        <StatCard label="도시" value="3곳" />
        <StatCard label="숙소" value="3개" />
        <StatCard label="항공편" value="5개" />
        <StatCard
          label="환율 (AUD → KRW)"
          value={audToKrw ? `${Math.round(audToKrw).toLocaleString()}원` : "로딩중"}
          sub={fxStatus}
        />
      </section>

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

      <SectionTitle title="📅 일정" />
      <div className="space-y-4">
        <div className="rounded-xl bg-white p-4 shadow">
          Day 1 (6/5) - 시드니 도착 / 호텔 체크인
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          Day 2~4 - 시드니 관광
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          Day 5 - 브리즈번 이동 → 골드코스트 이동
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          Day 6~8 - 골드코스트 여행
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          Day 9 - 브리즈번 → 한국 귀국
        </div>
      </div>
    </main>
  );
}