import { useState } from "react";

//Other imports here
import { Cloudinary, Transformation } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { image, text } from "@cloudinary/url-gen/qualifiers/source";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { Position } from "@cloudinary/url-gen/qualifiers";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { brightness } from "@cloudinary/url-gen/actions/adjust";
import { Button, Form } from "react-bootstrap";

export default function Tags({ formData }) {
  const [copy, setCopy] = useState("Copy");
  const { name, role, avatar } = formData;

  // new cloudinary instance with our cloudName here
  const cld = new Cloudinary({
    cloud: {
      cloudName: "Kizmelvin",
    },
  });

  let baseImage = cld
    .image(`local-uploads/p0dfljxd7somvjytf2tc`)
    .resize(scale().width(600).height(900));

  //baseImage transformations here
  baseImage.overlay(
    source(
      image(`${avatar}`).transformation(
        new Transformation()
          .resize(scale().width(370).height(370))
          .roundCorners(byRadius(230))
          .adjust(brightness(5))
      )
    ).position(new Position().gravity(compass("center")).offsetY(-80))
  );
  baseImage.overlay(
    source(
      text(`${name}`, new TextStyle("Nunito", 65)).textColor("white")
    ).position(new Position().gravity(compass("center")).offsetY(150))
  );
  baseImage.overlay(
    source(
      text(`${role}`, new TextStyle("Nunito", 70)).textColor("purple")
    ).position(new Position().gravity(compass("center")).offsetY(270))
  );
  const transformedImg = baseImage.toURL();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(transformedImg)
      .then(() => {
        setCopy("Copied!");
        setTimeout(() => {
          setCopy("Copy");
        }, 5000);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  return (
    <div className="mt-5">
      <AdvancedImage cldImg={baseImage} />
      <div>
        <label className="mt-2 p-2 fs-3"> Tag Address</label>
      </div>
      <div className="input-group mb-3 mt-1">
        <input
          type="text"
          className="form-control"
          value={transformedImg}
          aria-describedby="url-input"
          disabled
        />
        <div className="input-group-append">
          <Button
            onClick={handleCopy}
            className="input-group-text btn-primary"
            id="url-input"
          >
            {copy}
          </Button>
        </div>
      </div>
    </div>
  );
}
