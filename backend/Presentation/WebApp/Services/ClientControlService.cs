using Common;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using WebApp.Services.DTOs;

namespace WebApp.Services
{
    public class ClientControlService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ClientControlService> _logger;

        public ClientControlService(HttpClient httpClient, ILogger<ClientControlService> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(Configuration.ClientControlApiUrl);
            _logger = logger;
        }

        public async Task<IEnumerable<ClientDTO>> ListAllClientsAsync()
        {
            var response = await _httpClient.GetAsync("clients");

            try
            {
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                return responseString.FromJson<IEnumerable<ClientDTO>>();
            }
            catch (HttpRequestException)
            {
                throw new Exception("An error occur while trying get clients");
            }
        }

        public async Task<ClientDTO> GetClientByIdAsync(Guid id)
        {
            var response = await _httpClient.GetAsync($"clients/{id}");

            try
            {
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                return responseString.FromJson<ClientDTO>();
            }
            catch (HttpRequestException)
            {
                throw new Exception("An error occur while trying get clients");
            }
        }

        public async Task<Guid> CreateClientAsync(ClientDTO dto)
        {
            var content = dto.ToJson();
            var stringContent = new StringContent(content, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"clients", stringContent);
            try
            {
                response.EnsureSuccessStatusCode();
                var responseString = await response.Content.ReadAsStringAsync();
                return responseString.FromJson<Guid>();
            }
            catch (HttpRequestException hre)
            {
                throw new HttpRequestException(await GetWebExceptionAsync(hre, response, "Ocorreu um erro ao processar a solicitação"));
            }
        }

        private async Task<string> GetWebExceptionAsync(HttpRequestException hre, HttpResponseMessage response, string message)
        {
            var responseBody = string.Empty;
            var statusCode = HttpStatusCode.InternalServerError;
            try
            {
                using (var responseStream = await response.Content.ReadAsStreamAsync())
                {
                    responseBody = await new StreamReader(responseStream).ReadToEndAsync();
                    statusCode = response.StatusCode;
                }
            }
            catch
            {
                responseBody = "No reponse from server";
            }

            _logger.LogError(hre, "{message}. Response: {statusCode} - {reponseBody} ", message, statusCode, responseBody);

            return responseBody.HasValue() ? responseBody : message;
        }
    }
}
