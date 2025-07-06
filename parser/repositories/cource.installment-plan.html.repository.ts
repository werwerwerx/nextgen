import { SupabaseClient } from "@supabase/supabase-js";
import { CheerioAPI } from "cheerio";
import { InstallmentPlan, TariffName } from "../shared/course";
import { installmentPlanQueriesMap } from "../config/constants";

export class CourceInstallmentPlanHTMLRepository {

  extractInstallmentPlan = ($: CheerioAPI): InstallmentPlan => {
    const installmentPlan: Partial<InstallmentPlan> = {};

    try {
      (Object.entries(installmentPlanQueriesMap) as [TariffName, typeof installmentPlanQueriesMap[TariffName]][]).forEach(([tariffName, queries]) => {
        try {
          const tariffPlan: Partial<{
            "12": string;
            "24": string;
            "36": string;
          }> = {};

          // Проверяем каждый план рассрочки
          const plan12Element = $(queries["12"]);
          const plan24Element = $(queries["24"]);
          const plan36Element = $(queries["36"]);

          if (plan12Element.length > 0) {
            const plan12 = plan12Element.text().trim();
            if (plan12) tariffPlan["12"] = plan12;
          }

          if (plan24Element.length > 0) {
            const plan24 = plan24Element.text().trim();
            if (plan24) tariffPlan["24"] = plan24;
          }

          if (plan36Element.length > 0) {
            const plan36 = plan36Element.text().trim();
            if (plan36) tariffPlan["36"] = plan36;
          }

          if (Object.keys(tariffPlan).length > 0) {
            installmentPlan[tariffName] = tariffPlan;
          }
        } catch (error) {
          console.warn(`Не удалось извлечь план рассрочки для тарифа ${tariffName}:`, error);
        }
      });
    } catch (error) {
      console.warn("Ошибка при извлечении планов рассрочки:", error);
    }

    return installmentPlan as InstallmentPlan;
  }

}