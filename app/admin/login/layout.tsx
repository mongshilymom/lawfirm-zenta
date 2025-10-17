// 로그인 페이지는 부모 레이아웃의 인증 체크를 건너뛰기 위한 레이아웃
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
