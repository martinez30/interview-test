
using MediatR;
using System;

using Domain;

namespace Application.User.Commands.CreateUser
{
    public class CreateUserCommandRequest : IRequest<Guid>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public Profile Profile { get; set; }
    }
}
