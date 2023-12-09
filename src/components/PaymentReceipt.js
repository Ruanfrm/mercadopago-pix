import React from "react";
import { Paper, Typography } from "@mui/material";

function PaymentReceipt({ paymentData }) {
  // Certifique-se de que paymentData está disponível e tem os dados necessários
  if (!paymentData) {
    return null;
  }

  const {
    id,
    date_last_updated,
    transaction_amount,
    status,
    payer,
    payment_method_id,
    point_of_interaction,
    notification_url,
  } = paymentData;

  const paperStyle = {
    maxWidth: 400,
    padding: "16px",
    margin: "auto",
    marginTop: "32px",
  };

  const titleStyle = {
    marginBottom: "16px",
  };

  const itemStyle = {
    marginBottom: "8px",
  };

  return (
    <Paper elevation={3} style={paperStyle}>
      <Typography variant="h5" style={titleStyle}>
        Comprovante de Pagamento
      </Typography>
      <Typography style={itemStyle}>
        <strong>ID do Pagamento:</strong> {id}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Data de Aprovação:</strong> {date_last_updated && typeof date_last_updated === "string" ? date_last_updated : ""}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Valor:</strong> {transaction_amount || ""}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Status:</strong> {status && typeof status === "string" ? status : ""}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Pagador:</strong> {payer && payer.email && typeof payer.email === "string" ? payer.email : ""}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Método de Pagamento:</strong> {payment_method_id}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Local de Interação:</strong> {point_of_interaction && point_of_interaction.sub_type && typeof point_of_interaction.sub_type === "string" ? point_of_interaction.sub_type : ""}
      </Typography>
      <Typography style={itemStyle}>
        <strong>Web site:</strong> {notification_url && typeof notification_url === "string" ? <a href={notification_url} target="_black">{notification_url}</a> : ""}
      </Typography>
    </Paper>
  );
}

export default PaymentReceipt;
