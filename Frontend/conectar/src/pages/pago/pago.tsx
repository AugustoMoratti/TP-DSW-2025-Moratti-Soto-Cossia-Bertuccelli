import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import type { Trabajo } from "../../interfaces/trabajo.ts";

type ServiceInfo = {
  id: string;
  title: string;
  price: number;
};

export default function pagoPage({ service }: { service: ServiceInfo }) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Inicializar Mercado Pago UNA sola vez
  useEffect(() => {
    initMercadoPago("APP_USR-8e8768d5-dda1-4951-ad80-96c98a70d020");
  }, []);

  // Crear preferencia en el backend
  useEffect(() => {
    const createPreference = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/create-preference",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: [
                {
                  id: service.id,
                  title: service.title,
                  price: service.price,
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al crear la preferencia");
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId);
        console.log("Preference ID:", data.preferenceId);
      } catch (error) {
        console.error("Error creando la preferencia:", error);
      }
    };

    createPreference();
  }, [service]);

    return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>{service.title}</h2>
      <p>Monto a pagar: ${service.price}</p>

      {preferenceId && (
        <Wallet initialization={{ preferenceId }} />
      )}
    </div>
  );
};

