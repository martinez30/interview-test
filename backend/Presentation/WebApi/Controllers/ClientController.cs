﻿using Application.Client.Commands.CreateClient;
using Application.Client.Queries.AllClientsQuery;
using Application.Client.Queries.ClientByIdQuery;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClientController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
        public async Task<IActionResult> Create([FromBody] CreateClientCommandRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AllClientsQueryResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ListAll()
        {
            var response = await _mediator.Send(new AllClientsQueryRequest());
            return Ok(response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ClientByIdQueryResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var response = await _mediator.Send(new ClientByIdQueryRequest { Id = id });

            return Ok(response);
        }
    }
}
