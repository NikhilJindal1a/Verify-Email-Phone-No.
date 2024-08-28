import pandas as pd
import phonenumbers
import re
import dns.resolver

def validate_phone(phone_number):
    pattern = r'^(\+\d{1,3}\s?)?\d{6,14}$'
    if re.match(pattern, phone_number):
        return 'valid'
    else:
        return 'invalid'

def validate_email(email):
    if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        domain = email.split('@')[1]
        try:
            dns.resolver.resolve(domain, 'MX')
            return 'valid'
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers, dns.exception.Timeout):
            return 'invalid'
    return 'invalid'

def process_csv(file_path):
    df = pd.read_csv(file_path)
    df['phone1_valid'] = df['phone1'].apply(validate_phone)
    df['phone_valid'] = df['phone'].apply(validate_phone)
    df['email_valid'] = df['email'].apply(validate_email)
    df = df[['first_name', 'last_name', 'company_name', 'address', 'city', 'county', 'state', 'zip',
             'phone1', 'phone1_valid', 'phone', 'phone_valid', 'email', 'email_valid']]
    return df
