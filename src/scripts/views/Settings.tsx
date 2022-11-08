import { Button, Container } from "react-bootstrap";

export interface SettingsProps {
  clearAll: () => Promise<void>;
}

export function Settings(props: SettingsProps) {
  const onDeleteAll = () => {
    props.clearAll().catch((err) => console.error(err));
  };

  return (
    <Container className="d-flex justify-content-center mt-3">
      <Button variant="danger" onClick={onDeleteAll}>
        Delete data
      </Button>
    </Container>
  );
}
