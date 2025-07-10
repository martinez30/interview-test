﻿using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Configurations
{
    public class UserEntityTypeConfiguration : BaseEntityTypeConfiguration<User>
    {
        public override void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable(nameof(User));
            builder.Property(u => u.Username).IsRequired().HasColumnType("varchar(50)");
            builder.HasIndex(u => u.Username).IsUnique();
            builder.Property(u => u.PasswordHash).IsRequired().HasColumnType("varchar(255)");
            builder.Property(u => u.Profile)
                .HasConversion<string>();
        }
    }
}
