import { cookies } from "next/headers";
import { LocalDate } from "./components/localDate";

export default async function Home() {
  // server action 로그인용
  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const pass = formData.get("password");
    const response = await fetch("https://localhost:8443/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        pass,
      }),
    });

    // 문자열로 오기 때문에 headers의 cookie 내용 파싱
    const cookieList = response.headers.getSetCookie().map((cookie) => {
      return cookie.split(";")[0];
    });

    const cookieStore = cookies();
    // 브라우저에 cookie가 set 되도록
    cookieList.forEach((item) => {
      const [key, value] = item.split("=");
      cookieStore.set(key, value, { httpOnly: true, secure: true });
    });
  }

  let data = "accessToken이 있으면 데이터가 불러와 집니다.";
  if (true) {
    // 리소스 불러오기

    // 브라우저에서 accessToken 쿠키 가져오기
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // 두 쿠키의 토큰 값이 가져와지는지 확인용도 (로직에 불필요 확인용)
    const refreshToken = cookieStore.get("refreshToken")?.value;
    console.log(refreshToken);
    // 잘 불러와진다.

    if (accessToken) {
      // 있으면 요청 해보기
      try {
        const response = await fetch("https://localhost:8443/resource", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}`,
          },
        });

        const res = await response.json();
        data = res.message;
      } catch {
        console.error("Failed to fetch data");
      }
    }
  }

  const currentDate = new Date();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="h-fit">
        <form action={login}>
          <div className="flex flex-col gap-4 text-black">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Your email"
            />
            <input
              type="password"
              name="password"
              placeholder="Your password"
              aria-label="Your password"
            />
            <button className="text-white">Login</button>
          </div>
        </form>
      </div>

      <div className="w-full mt-5 border-t-2 border-white">
        <div className="h-16 w-full mt-5">
          <div className="flex flex-col gap-4 text-white text-center">
            <button>데이터 로드 유무</button>
            <div>{data}</div>
          </div>
        </div>
      </div>

      <div className="w-full mt-5 border-t-2 border-white">
        <div className="h-5 w-full mt-5">
          <div className="flex flex-col gap-4 text-white text-center">
            <div>TimeZone UTC</div>
            <div>{currentDate.toISOString()}</div>
          </div>
          <div className="flex flex-col gap-4 mt-8 text-white text-center">
            <div>TimeZone Local</div>
            <LocalDate currentDate={currentDate} />
          </div>
        </div>
      </div>
    </main>
  );
}
