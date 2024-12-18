const app = require("../config/app");
const logger = require("../utils/logger");
const WebSocket = require("ws");
var _ = require("lodash");
const _isArray = require("../utils/_isArray");

class ApiRequest {
  constructor(session_name, bot_name) {
    this.bot_name = bot_name;
    this.session_name = session_name;
  }

  async get_user_info(http_client) {
    try {
      const response = await http_client.get(`${app.apiUrl}/api/v1/users/me`);
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while getting user info: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting user info: ${error.message}`
        );
      }

      return null;
    }
  }

  async validate_query_id(http_client) {
    try {
      await http_client.get(`${app.apiUrl}/api/v1/users/me`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async get_mine_info(http_client) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/mining/status`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while getting mine info: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting mine info: ${error.message}`
        );
      }

      return null;
    }
  }

  async get_pixels_info() {
    const url = "wss://notpx.app/api/v2/image/ws";
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      let isResolved = false;

      ws.on("open", () => {});

      ws.on("message", (data) => {
        if (isResolved) return;

        const response = data.toString();
        try {
          if (_isArray(response)) {
            const parsedResponse = JSON.parse(response);
            if (parsedResponse && parsedResponse.data) {
              isResolved = true;
              resolve(parsedResponse.data);
            } else {
              // Если формат неверный, разбиваем ответ на строки и возвращаем
              isResolved = true;
              resolve(response.split("\n"));
            }
          } else {
            isResolved = true;
            resolve(response.split("\n")); // Возвращаем ответ в виде массива строк
          }
        } catch (error) {
          if (!isResolved) {
            isResolved = true;
            reject(new Error("WebSocket ошибка: " + error.message));
          }
        } finally {
          ws.close();
        }
      });

      ws.on("error", (error) => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error("WebSocket ошибка: " + error.message));
          ws.close();
        }
      });
    });
  }

  async claim_mine(http_client) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/mining/claim`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming mine: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while claiming mine: ${error.message}`
        );
      }

      return null;
    }
  }

  async claim_task(http_client, task) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/mining/task/check/${task}`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming task: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while claiming task: ${error.message}`
        );
      }

      return null;
    }
  }

  async repaint(http_client, paint) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/api/v1/repaint/start`,
        JSON.stringify(paint)
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while painting: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while painting: ${error.message}`
        );
      }

      return null;
    }
  }

  async go_to_page(http_client, page) {
    try {
      const response = await http_client.post(
        `${app.pageUrl}/api/event`,
        JSON.stringify({
          n: "pageview",
          u: "https://app.notpx.app" + page,
          d: "notpx.app",
          r: null,
        })
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.error) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while viewing page: ${error?.response?.data?.error}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while viewing page: ${error.message}`
        );
      }

      return null;
    }
  }
}

module.exports = ApiRequest;
