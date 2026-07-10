import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import FloatingParticles from "../FloatingParticles";
import SubstackEmbed from "../SubstackEmbed";

const MagicCode = () => {
  const navigate = useNavigate();
  const magicRef = useRef(null);

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const animate = (star: HTMLElement) => {
    star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
    star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

    star.style.animation = "none";
    void star.offsetHeight; // This line triggers a reflow
    star.style.animation = "";
  };

  const GlowingButton = styled(Button)`
		background: cyan;
		color: black;
		border: none;
		padding: 10px 40px;
		text-align: center;
		text-decoration: none;
      font-family: 'Berlin Sans FB Demi Bold', sans-serif;
      font-weight: 800;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.3s, box-shadow 0.2s;
		position: relative;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			border-radius: 4px;
			opacity: 0;
			transition: opacity 0.3s, transform 0.3s;
		}

		&:hover {
			background: white;
	`;
  useEffect(() => {
    let index = 0,
      interval = 1000;

    // @ts-ignore
    const stars = magicRef.current.getElementsByClassName("magic-star");

    for (const star of stars) {
      setTimeout(
        () => {
          animate(star);
          setInterval(() => animate(star), 2000);
        },
        index++ * (interval / 3),
      );
    }
  }, []);

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <div id={"WrapperStar"} className={"WrapperStar"}>
        <div className="body-div" ref={magicRef}>
          <h1>
            Are you ready to explore the
            <span className="magic">
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-star">
                <svg viewBox="0 0 512 512">
                  <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                </svg>
              </span>
              <span className="magic-text">Etherworld</span>
            </span>
            ?
          </h1>
        </div>
        <div>
          <div className="btn-group">
            <div>
              <GlowingButton onClick={() => navigate("/onboarding")}>Play now</GlowingButton>
            </div>
          </div>
        </div>
        {/* <div className="substack-container">
                    <SubstackEmbed />
                </div> */}
      </div>
    </>
  );
};

export default MagicCode;
