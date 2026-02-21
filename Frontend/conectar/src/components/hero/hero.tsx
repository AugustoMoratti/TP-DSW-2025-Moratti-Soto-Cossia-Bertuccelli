import { useRef, useEffect } from "react";
import { animate, splitText, stagger } from "animejs";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import heroImage from "../../../assets/plomero.png";
import logo from "../../../assets/conect.png";
import img1 from "../../../assets/laburante_1.png";
import img2 from "../../../assets/laburante_2.png";
import img3 from "../../../assets/laburante_3.png";
import "./hero.css";
import { useNavigate } from "react-router";

const Hero: React.FC = () => {

  const buttonRegisterRef = useRef<HTMLButtonElement | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  const Navigate = useNavigate();

  useEffect(() => {
    const button = buttonRegisterRef.current;
    if (!button) return;

    const handleEnter = () => {
      animate(button, {
        scale: 1.15,
        duration: 300,
        ease: "out(3)",
      });
    };

    const handleLeave = () => {
      animate(button, {
        scale: 1,
        duration: 300,
        ease: "out(3)",
      });
    };

    button.addEventListener("mouseenter", handleEnter);
    button.addEventListener("mouseleave", handleLeave);

    return () => {
      button.removeEventListener("mouseenter", handleEnter);
      button.removeEventListener("mouseleave", handleLeave);

      // limpiar timer si existe
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {

    // TEXTO
    const { words } = splitText("h2", {
      words: { wrap: "clip" },
    });

    animate(words, {
      y: [{ to: ["100%", "0%"] }],
      duration: 750,
      ease: "out(3)",
      delay: stagger(100),
      loop: false,
    });

    //LOGO
    animate(".logo", {
      opacity: { from: 0.5 },
      translateX: { from: "16rem" },
    });

    // TEXTO AL LADO DEL LOGO
    animate(".text_logo, p", {
      opacity: { from: 0.5 },
      translateX: { from: "16rem" },
    });

    // BUTTON
    animate(".button-register-hero", {
      opacity: { from: 0 },
      translateY: { from: "2rem" },
    });

  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero_text">
          <h2>
            ¿Buscas un <br /> profesional confiable?
          </h2>
          <br />
          <div className="text_logo">
            <strong>
              <p>Estás buscando</p>
            </strong>
            <img src={logo} alt="Conectar Logo" className="logo" />
          </div>
        </div>

        <div className="hero_image">
          <img src={heroImage} alt="Hero" />
        </div>
      </section>
      <div className="register-container">
        <button
          className="button-register-hero"
          onClick={() => Navigate("/register")}
        >
          <HowToRegIcon/> <strong>Registrate</strong> Gratis y empeza a trabajar
        </button>
      </div>

      <div>
        <div className="text_info">
          <div className="card_info izq">
            <p>
              ¿Necesitas un servicio profesional? <br />
              Encuentra profesionales calificados en diversas áreas y servicios.{" "}
              <br />
              ¡Conectar te ayuda a conectar con los mejores expertos cerca de ti!
            </p>
            <img src={img1} alt="Personaje que trabaja" className="img_work" />
          </div>

          <div className="card_info der">
            <img src={img2} alt="Personaje que trabaja" className="img_work" />
            <p>
              ¿Eres un profesional? <br />
              Regístrate en nuestra plataforma y amplía tu alcance. <br />
              Conectar te conecta con clientes que buscan tus habilidades para que
              los ayudes.
            </p>
          </div>

          <div className="card_info center">
            <p>
              ¡Únete a Conectar hoy mismo y descubre un mundo de oportunidades!{" "}
              <br />
              Ya sea que busques servicios o quieras ofrecerlos, <br />
              Conectar es tu aliado confiable para conectar con profesionales y
              clientes de manera fácil y segura.
            </p>
            <img src={img3} alt="Personaje que trabaja" className="img_work" />
          </div>
        </div>
      </div>

      <div className="vacio"></div>
    </>
  );
};

export default Hero;
