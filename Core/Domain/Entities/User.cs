using System;

namespace Domain
{
    public class User : BaseEntity
    {
        public string Username { get; private set; }
        public string PasswordHash { get; private set; }
        public string Role { get; private set; }

        public User() { }

        public User(string username, string passwordHash, string role)
        {
            Username = username;
            PasswordHash = passwordHash;
            Role = role;
        }
    }
}
