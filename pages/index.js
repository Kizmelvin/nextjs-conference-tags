import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import Tags from "../Components/Tag";

const initialState = { name: "", avatar: "", role: "" };

export default function IndexPage() {
  const [formData, setFormData] = useState(initialState);
  const [showTag, setShowTag] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);
    };
    const files = e.target.files[0];
    if (!files) return;
    const data = new FormData();
    data.append("file", files);
    data.append("upload_preset", "c_tags");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/kizmelvin/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();
    setFormData({ ...formData, avatar: file.public_id });
    setLoading(false);
  };

  return (
    <div className="container-fluid">
      <h1 className="fs-1 m-3 text-center"> Auto Generate Conference Tags</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div style={{ width: "400px" }}>
          <h3 className="fs-4 p-3 "> Enter your details</h3>
          <Form className="mt-3">
            <Form.Group className="mb-1 h-10">
              <Form.Label className="fs-5">Name</Form.Label>
              <Form.Control
                size="md"
                type="text"
                name="name"
                required
                disabled={disableInput}
                onChange={handleChange}
                value={formData.name ?? ""}
                placeholder="Your name"
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label className="fs-5">Avatar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e)}
                disabled={disableInput}
              />
            </Form.Group>
            <h4 className="mt-3 mb-3">Choose Role</h4>
            <div className="mb-3">
              <Form.Check
                type="radio"
                label={`Speaker`}
                value={`SPEAKER` ?? ""}
                name="role"
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label={`Attendee`}
                value={`ATTENDEE` ?? ""}
                name="role"
                onChange={handleChange}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setShowTag(true);
                  setDisableInput(true);
                  setLoading(true);
                }}
                type="submit"
                variant="primary"
                disabled={loading}
              >
                Generate Tag
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setFormData(initialState);
                  setShowTag(false);
                  setDisableInput(false);
                  setLoading(true);
                }}
                type="submit"
                variant="primary"
              >
                New Tag
              </Button>
            </div>
          </Form>
        </div>
        {showTag && (
          <Tags
            formData={formData}
            setFormData={setFormData}
            initialState={initialState}
          />
        )}
      </div>
    </div>
  );
}
