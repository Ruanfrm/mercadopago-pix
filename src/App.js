import React, { useReducer, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Input, InputAdornment, InputLabel } from "@mui/material/";
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

import PaymentReceipt from "./components/PaymentReceipt";

import "./App.css";

const api = axios.create({
  baseURL: "https://api.mercadopago.com",
});

api.interceptors.request.use(async (config) => {
  const token = process.env.REACT_APP_TOKEN_MERCADO_PAGO
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

function App() {
  const [formData, setFormdata] = useReducer(formReducer, {});
  const [responsePayment, setResponsePayment] = useState(false);
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(false);
  const [statusPayment, setStatusPayment] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 

  // Adicione um novo estado para armazenar o valor escolhido
  const [chosenAmount, setChosenAmount] = useState(0.1); // Valor padrão inicial

  

  const handleChange = (event) => {
    setFormdata({
      name: event.target.name,
      value: event.target.value,
    });

    // Se o campo atual for o campo de valor, atualize o estado
    if (event.target.name === "amount") {
      setChosenAmount(parseFloat(event.target.value) || 0); // Converte para float, ou assume 0 se não puder ser convertido
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarState({ open: true, message, severity });
  };

  const validateForm = () => {
    const { email, nome, cpf } = formData;
    return email && nome && cpf;
  };

  // ... (código anterior)

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showSnackbar("Preencha todos os campos antes de pagar.", "error");
      return;
    }

    const body = {
      transaction_amount: chosenAmount,
      description: "Produto teste de desenvolvimento",
      payment_method_id: "pix",
      payer: {
        email: formData.email,
        first_name: formData.nome,
        last_name: "Obrigado Pela compra!",
        identification: {
          type: "CPF",
          number: formData.cpf,
        },
      },
      notification_url: "https://ruanfr.com",
    };

    api
      .post("v1/payments", body)
      .then((response) => {
        setResponsePayment(response);
        setLinkBuyMercadoPago(
          response.data.point_of_interaction.transaction_data.ticket_url
        );
        showSnackbar(
          `Pagamento gerado com sucesso no valor de R$: ${chosenAmount}!`,
          "success"
        );
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Erro ao processar pagamento. Tente novamente.", "error");
      });
  };

  // ... (código anterior)

  const getStatusPayment = () => {
    api.get(`v1/payments/${responsePayment.data.id}`)
      .then((response) => {
        if (response.data.status === "approved") {
          console.log(response)
          setStatusPayment(true);
          showSnackbar("Pagamento realizado com sucesso!", "success");
        } else if (response.data.status === "pending") {
          showSnackbar("Aguardando pagamento. Por favor, aguarde.", "info");
        } else {
          showSnackbar("Pagamento não foi aprovado.", "warning");
        }
      })
      .catch((err) => {
        console.error(err);
        showSnackbar("Erro ao obter status do pagamento. Tente novamente.", "error");
      });
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>PIX com API do Mercado Pago</h1>

        {!responsePayment && (
          <form onSubmit={handleSubmit}>
            <div className="input">
              <TextField
                label="E-mail"
                variant="standard"
                onChange={handleChange}
                name="email"
                style={{ width: "350px" }}
              />
            </div>
            <div className="input">
              <TextField
                label="Nome"
                variant="standard"
                onChange={handleChange}
                name="nome"
                style={{ width: "350px" }}
              />
            </div>
            <div className="input">
              <TextField
                label="CPF"
                variant="standard"
                onChange={handleChange}
                name="cpf"
                style={{ width: "350px" }}
              />
            </div>
            <div className="input">
              <InputLabel htmlFor="standard-adornment-amount">
                Digite um valor
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Valor"
                variant="outlined"
                onChange={handleChange}
                name="amount"
                type="number"
                style={{ width: "350px" }}
              />
            </div>

            <div className="button">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!validateForm()}
                fullWidth
              >
                Pagar
              </Button>
            </div>
          </form>
        )}

        {/* Botão para verificar status com ícone */}
        {responsePayment && (
          <IconButton onClick={getStatusPayment} color="primary" aria-label="Verificar status pagamento">
            <RefreshIcon />
          </IconButton>
        )}

        {linkBuyMercadoPago && !statusPayment && (
          <iframe
            src={linkBuyMercadoPago}
            width="100%"
            height="700px"
            title="link_buy"
          />
        )}

 {/* Renderiza o comprovante após o pagamento ser aprovado */}
 {statusPayment && (
        <PaymentReceipt paymentData={responsePayment.data} />
      )}
        <Snackbar
          open={snackbarState.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarState.severity}
          >
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </header>
      </div>
  );
}

export default App;
