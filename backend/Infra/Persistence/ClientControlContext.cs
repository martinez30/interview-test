using Application.Common.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Persistence
{
    public class ClientControlContext : DbContext, IClientControlContext
    {
        public DbSet<Client> Clients { get; set; }

        public ClientControlContext(DbContextOptions<ClientControlContext> options) : base(options) { }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                if (entry.Entity.CreatedAt == DateTime.MinValue)
                {
                    entry.Entity.SetCreatedAt(DateTime.UtcNow);
                    entry.State = EntityState.Added;
                }
                else if (entry.State == EntityState.Modified)
                    entry.Entity.SetModifiedAt(DateTime.UtcNow);
            }
            return await base.SaveChangesAsync(cancellationToken);
        }

        public void AttachModelToContext<T>(T entity)
        {
            base.Attach(entity);
        }

        public IExecutionStrategy CreateExecutionStrategy()
        {
            return Database.CreateExecutionStrategy();
        }

        public void SetModifiedState<T>(T entity)
        {
            base.Entry(entity).State = EntityState.Modified;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ClientControlContext).Assembly);
        }
    }
}
