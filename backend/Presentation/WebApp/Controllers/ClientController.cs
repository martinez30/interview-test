using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Models.Client;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class ClientController : Controller
    {
        private readonly ILogger<ClientController> _logger;
        private readonly ClientControlService _clientControlService;

        public ClientController(ILogger<ClientController> logger, ClientControlService clientControlService)
        {
            _logger = logger;
            _clientControlService = clientControlService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var clients = await _clientControlService.ListAllClientsAsync();
            var vm = clients.Select(x => new ClientViewModel(x));
            return View(vm);
        }

        [HttpGet]
        public async Task<IActionResult> Detail(Guid id)
        {
            var client = await _clientControlService.GetClientByIdAsync(id);
            var vm = new ClientViewModel(client);
            return View(vm);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(ClientViewModel vm)
        {
            if (!ModelState.IsValid)
                return View(vm);

            try
            {
                await _clientControlService.CreateClientAsync(vm.ToDTO());
            }
            catch (Exception e)
            {
                ModelState.AddModelError("", e.Message);
                return View(vm);

            }

            return RedirectToAction("Index");
        }

    }
}
