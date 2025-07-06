﻿using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IClientControlContext
    {
        DbSet<Domain.Client> Clients { get; set; }

        IExecutionStrategy CreateExecutionStrategy();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        void SetModifiedState<T>(T entity);
        void AttachModelToContext<T>(T entity);
    }
}
