import React, { useReducer, useState } from "react";
import './App.css';
import axios from "axios";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Input,
  InputAdornment,
  InputLabel,
  IconButton,
  CircularProgress,
  Paper,
  Typography,
  FormControl,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import AssignmentIcon from "@mui/icons-material/Assignment";

import PaymentReceipt from "./components/PaymentReceipt";

import api from './axiosConfig'



const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

// ... (importações)

function App() {
  const [formData, setFormdata] = useReducer(formReducer, {});
  const [responsePayment, setResponsePayment] = useState(null);
  const [linkBuyMercadoPago, setLinkBuyMercadoPago] = useState(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chosenAmount, setChosenAmount] = useState(0.1);

  


  const handleChange = (event) => {
    setFormdata({
      name: event.target.name,
      value: event.target.value,
    });

    if (event.target.name === "amount") {
      setChosenAmount(parseFloat(event.target.value) || 0);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || chosenAmount < 0.1) {
      showSnackbar("Preencha todos os campos e escolha um valor válido.", "error");
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

    try {
      setLoading(true);
      setError(null);
      const response = await api.post("v1/payments", body);
      setResponsePayment(response);
      setLinkBuyMercadoPago(
        response.data.point_of_interaction.transaction_data.ticket_url
      );
      showSnackbar(
        `Pagamento gerado com sucesso no valor de R$: ${chosenAmount}!`,
        "success"
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao processar pagamento. Tente novamente.");
      showSnackbar("Erro ao processar pagamento. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusPayment = async () => {
    try {
      const response = await api.get(`v1/payments/${responsePayment.data.id}`);
      if (response.data.status === "approved") {
        setStatusPayment(true);
        showSnackbar("Pagamento realizado com sucesso!", "success");
      } else if (response.data.status === "pending") {
        showSnackbar(
          "Aguardando pagamento. Por favor, aguarde.",
          "info"
        );
      } else {
        showSnackbar("Pagamento não foi aprovado.", "warning");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(
        "Erro ao obter status do pagamento. Tente novamente.",
        "error"
      );
    }
  };

  return (
    <div className="App">
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "600px", margin: "auto", marginTop: '2rem' }}>
        <Typography className="title" variant="h5">Checkout de pagamento PIX</Typography>
        {!responsePayment && (
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="E-mail"
                variant="outlined"
                onChange={handleChange}
                name="email"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Nome"
                variant="outlined"
                onChange={handleChange}
                name="nome"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="CPF"
                variant="outlined"
                onChange={handleChange}
                name="cpf"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="standard-adornment-amount">
                Digite um valor
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Valor"
                variant="outlined"
                onChange={handleChange}
                name="amount"
                type="number"
                fullWidth
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validateForm() || loading}
              fullWidth
              style={{ marginTop: "20px" }}
            >
              {loading ? <CircularProgress size={24} /> : "Pagar"}
            </Button>
            {error && (
              <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>
                {error}
              </Typography>
            )}
          </form>
        )}

        {/* footer */}
        <p style={{marginTop: '2rem', textAlign: 'center'}}>Feito com ❤️ por Ruan Freire</p>

        {responsePayment && (
          <IconButton
            onClick={getStatusPayment}
            color="primary"
            aria-label="Verificar status pagamento"
            style={{ marginTop: "20px" }}
          >
            <RefreshIcon />
          </IconButton>
        )}

        {linkBuyMercadoPago && !statusPayment && (
          <iframe
            src={linkBuyMercadoPago}
            width="100%"
            height="400px"
            title="link_buy"
            style={{ marginTop: "20px" }}
          />
        )}

        {statusPayment && (
          <div>
            <PaymentReceipt paymentData={responsePayment.data} />
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Compra concluída com sucesso!
            </Typography>
          </div>
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
      </Paper>
    </div>
  );
}

export default App;