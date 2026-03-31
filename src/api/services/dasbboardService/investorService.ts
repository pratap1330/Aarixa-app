// services/investorService.ts
import API from "../../client";

export const getInvestorDataService = async (params: {
  cid: number;
  levelNo: number;
}) => {
  const response = await API.get(`/api/investor/getInvestorData`, {
    params,
  });
  return response.data;
};