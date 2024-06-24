import axios from "axios";

export async function sendMessage(
  baseUrl: string,
  flowId: string,
  message: string,
  chat_inputs: any, // dict
  input_field: string, // 标签
  sessionId: React.MutableRefObject<string>,
  tweaks?: Object,
  api_key?: string,
  additional_headers?: { [key: string]: string }
) {
  let data: any = {};
  //   if (tweaks) {
  //   const data: any = {
  //     inputs: chat_inputs, // 确保inputs属性存在
  //   };
  //   chat_inputs[input_field] = message;
  if (tweaks) {
    // 根据这里的接口来看是message， 可能有别的模型是chat_inputs,chat_inputs 相当于 外层嵌套了一个input {}
    data[input_field] = message ? message : chat_inputs[input_field];
    // data[input_field] = chat_inputs;
    data["tweaks"] = tweaks;
    console.log(">>>>> with tweaks", data);
  } else {
    data[input_field] = message ? message : chat_inputs[input_field];
    // data[input_field] = chat_inputs;
  }
  let headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  if (api_key) {
    headers["x-api-key"] = api_key;
  }
  if (additional_headers) {
    headers = Object.assign(headers, additional_headers);
    // headers = {...headers, ...additional_headers};
  }
  console.log(">>>> sessionId", sessionId);
  if (sessionId.current && sessionId.current !== "") {
    console.log(sessionId)
    data.session_id = sessionId.current;
  }
  // 发送POST请求
  try {
    const response = await axios.post(`${baseUrl}/api/v1/run/${flowId}`, data, {
      headers,
    });
    console.log(">>>> 请求头", data);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // 抛出错误，以便调用者可以处理
  }
}
