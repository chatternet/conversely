import { Header, HeaderProps } from "./Header";
import { ReactNode } from "react";
import { Container } from "react-bootstrap";

export interface ScaffoldProps {
  backsplash: boolean;
  headerProps: HeaderProps;
  children: ReactNode;
}

export function Scaffold(props: ScaffoldProps) {
  return (
    <>
      <div className="bg-white pb-5">
        <Header {...props.headerProps} />
        {props.backsplash ? (
          <div style={{ position: "relative", width: "100%", height: 0 }}>
            <div className="backsplash" style={{ position: "absolute" }}></div>
          </div>
        ) : null}
        {props.children}
      </div>
      <footer className="text-center text-light">
        <Container className="max-width-md p-5">Conversely</Container>
      </footer>
    </>
  );
}
